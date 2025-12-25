<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$action = isset($_GET['action']) ? $_GET['action'] : '';
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : '';

if ($action == 'list' && !empty($user_id)) {
    $query = "SELECT p.*, u.name as creator_name, pf.created_at as fav_date
              FROM prompt_favorites pf
              JOIN prompts p ON pf.prompt_id = p.id
              JOIN users u ON p.user_id = u.id
              WHERE pf.user_id = :user_id
              ORDER BY pf.created_at DESC";

    $stmt = $db->prepare($query);
    $stmt->bindParam(":user_id", $user_id);
    $stmt->execute();

    $prompts = [];
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        array_push($prompts, $row);
    }
    echo json_encode(["status" => "success", "data" => $prompts]);
    exit();
}

if ($action == 'toggle') {
    $data = json_decode(file_get_contents("php://input"));
    
    if(!empty($data->user_id) && !empty($data->prompt_id)){
        $check = "SELECT id FROM prompt_favorites WHERE user_id=:uid AND prompt_id=:pid";
        $stmt = $db->prepare($check);
        $stmt->bindParam(":uid", $data->user_id);
        $stmt->bindParam(":pid", $data->prompt_id);
        $stmt->execute();

        if($stmt->rowCount() > 0){
            $del = "DELETE FROM prompt_favorites WHERE user_id=:uid AND prompt_id=:pid";
            $stmtDel = $db->prepare($del);
            $stmtDel->bindParam(":uid", $data->user_id);
            $stmtDel->bindParam(":pid", $data->prompt_id);
            $stmtDel->execute();
            echo json_encode(["status" => "success", "message" => "Dihapus dari Favorit", "is_favorite" => false]);
        } else {
            $ins = "INSERT INTO prompt_favorites (user_id, prompt_id) VALUES (:uid, :pid)";
            $stmtIns = $db->prepare($ins);
            $stmtIns->bindParam(":uid", $data->user_id);
            $stmtIns->bindParam(":pid", $data->prompt_id);
            $stmtIns->execute();
            echo json_encode(["status" => "success", "message" => "Disimpan ke Favorit", "is_favorite" => true]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
    }
}
?>