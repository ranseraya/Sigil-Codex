<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();
$data = json_decode(file_get_contents("php://input"));

if(!empty($data->user_id) && !empty($data->name)){
    $query = "INSERT INTO collections (user_id, name) VALUES (:uid, :name)";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":uid", $data->user_id);
    $stmt->bindParam(":name", $data->name);

    if($stmt->execute()){
        echo json_encode(["status" => "success", "id" => $db->lastInsertId()]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal membuat folder"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap"]);
}
?>