<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$id = isset($_GET['id']) ? $_GET['id'] : die();
$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

$query = "DELETE FROM prompts WHERE id = :id AND user_id = :user_id";
$stmt = $db->prepare($query);

$stmt->bindParam(":id", $id);
$stmt->bindParam(":user_id", $user_id);

if($stmt->execute()){
    if($stmt->rowCount() > 0){
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Prompt dihapus."]);
    } else {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Prompt tidak ditemukan atau bukan milik Anda."]);
    }
} else {
    http_response_code(503);
    echo json_encode(["status" => "error", "message" => "Gagal menghapus."]);
}
?>