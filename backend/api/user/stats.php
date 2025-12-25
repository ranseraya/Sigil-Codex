<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();

$query1 = "SELECT COUNT(*) as total FROM prompts WHERE user_id = :uid";
$stmt1 = $db->prepare($query1);
$stmt1->bindParam(":uid", $user_id);
$stmt1->execute();
$row1 = $stmt1->fetch(PDO::FETCH_ASSOC);
$total_prompts = $row1['total'];

$query2 = "SELECT COUNT(*) as total 
           FROM prompt_likes pl
           JOIN prompts p ON pl.prompt_id = p.id
           WHERE p.user_id = :uid";
$stmt2 = $db->prepare($query2);
$stmt2->bindParam(":uid", $user_id);
$stmt2->execute();
$row2 = $stmt2->fetch(PDO::FETCH_ASSOC);
$total_likes_received = $row2['total'];

echo json_encode([
    "status" => "success",
    "data" => [
        "prompts" => $total_prompts,
        "likes_received" => $total_likes_received
    ]
]);
?>