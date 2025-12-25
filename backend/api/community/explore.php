<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$sort = isset($_GET['sort']) ? $_GET['sort'] : 'newest'; // newest, popular, oldest
$current_user_id = isset($_GET['user_id']) ? $_GET['user_id'] : 0;

$query = "SELECT p.*, u.name as creator_name,
          (SELECT COUNT(*) FROM prompt_likes WHERE prompt_id = p.id) as total_likes,
          (SELECT COUNT(*) FROM prompt_likes WHERE prompt_id = p.id AND user_id = :uid) as is_liked_by_me
          FROM prompts p
          JOIN users u ON p.user_id = u.id
          WHERE p.is_public = 1 ";

// Logic Sorting
if ($sort == 'popular') {
    $query .= "ORDER BY total_likes DESC, p.created_at DESC";
} else if ($sort == 'oldest') {
    $query .= "ORDER BY p.created_at ASC";
} else {
    // Default: Newest
    $query .= "ORDER BY p.created_at DESC";
}

$stmt = $db->prepare($query);
$stmt->bindParam(":uid", $current_user_id);
$stmt->execute();

$prompts_arr = array();
while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
    $row['is_liked'] = $row['is_liked_by_me'] > 0; 
    array_push($prompts_arr, $row);
}

echo json_encode(["status" => "success", "data" => $prompts_arr]);
?>