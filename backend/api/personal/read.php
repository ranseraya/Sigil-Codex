<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$user_id = isset($_GET['user_id']) ? $_GET['user_id'] : die();
$search = isset($_GET['search']) ? $_GET['search'] : "";

$query = "SELECT * FROM prompts WHERE user_id = :user_id";

if(!empty($search)){
    $query .= " AND (title LIKE :search OR content LIKE :search OR category LIKE :search)";
}

$query .= " ORDER BY created_at DESC";

$stmt = $db->prepare($query);
$stmt->bindParam(":user_id", $user_id);

if(!empty($search)){
    $search_term = "%{$search}%";
    $stmt->bindParam(":search", $search_term);
}

$stmt->execute();
$num = $stmt->rowCount();

if($num > 0){
    $prompts_arr = array();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        array_push($prompts_arr, $row);
    }
    http_response_code(200);
    echo json_encode(["status" => "success", "data" => $prompts_arr]);
} else {
    http_response_code(200);
    echo json_encode(["status" => "success", "data" => []]);
}
?>