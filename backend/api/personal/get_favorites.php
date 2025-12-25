<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

if (!isset($_GET['user_id'])) {
    echo json_encode(["status" => "error", "message" => "User ID diperlukan"]);
    exit();
}

$user_id = intval($_GET['user_id']);

try {
$query = "
        SELECT 
            p.id, 
            p.title, 
            p.description, 
            p.content, 
            p.category, 
            p.platform, 
            p.created_at,
            
            -- PERBAIKAN DI SINI:
            -- Sesuaikan 'u.name' dengan nama kolom asli di database Anda (misal: u.full_name)
            u.name AS username, 
            
            (SELECT COUNT(*) FROM prompt_likes WHERE prompt_id = p.id) as total_likes, 
            1 as is_liked
        FROM prompt_likes l 
        JOIN prompts p ON l.prompt_id = p.id
        LEFT JOIN users u ON p.user_id = u.id
        WHERE l.user_id = :uid
        ORDER BY l.created_at DESC
    ";

    $stmt = $db->prepare($query);
    $stmt->bindParam(':uid', $user_id);
    $stmt->execute();

    $prompts = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(["status" => "success", "data" => $prompts]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>