<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->user_id) && !empty($data->prompt_id)){
    $check = "SELECT id FROM prompt_likes WHERE user_id = :uid AND prompt_id = :pid";
    $stmt = $db->prepare($check);
    $stmt->bindParam(":uid", $data->user_id);
    $stmt->bindParam(":pid", $data->prompt_id);
    $stmt->execute();

    if($stmt->rowCount() > 0){
        // SUDAH LIKE -> UNLIKE
        $query = "DELETE FROM prompt_likes WHERE user_id = :uid AND prompt_id = :pid";
        $msg = "Unliked";
        $liked = false;
    } else {
        // BELUM LIKE -> LIKE
        $query = "INSERT INTO prompt_likes (user_id, prompt_id) VALUES (:uid, :pid)";
        $msg = "Liked";
        $liked = true;
    }

    $action = $db->prepare($query);
    $action->bindParam(":uid", $data->user_id);
    $action->bindParam(":pid", $data->prompt_id);

    if($action->execute()){
        echo json_encode(["status" => "success", "message" => $msg, "is_liked" => $liked]);
    } else {
        echo json_encode(["status" => "error", "message" => "Database error"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Incomplete data"]);
}
?>