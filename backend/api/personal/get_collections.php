<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

$query = "SELECT * FROM collections WHERE user_id = :uid ORDER BY created_at DESC";
$stmt = $db->prepare($query);
$stmt->bindParam(":uid", $user_id);
$stmt->execute();

$collections = [];
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
    array_push($collections, $row);
}

echo json_encode(["status" => "success", "data" => $collections]);
?>