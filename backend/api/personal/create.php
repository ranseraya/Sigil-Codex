<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->user_id) &&
    !empty($data->title) &&
    !empty($data->content)
) {
    $query = "INSERT INTO prompts 
          SET user_id=:user_id, title=:title, description=:description, 
              content=:content, example_output=:example_output, 
              category=:category, collection_id=:cid, platform=:platform, is_public=:is_public";

    $stmt = $db->prepare($query);

    // Sanitasi & Binding
    $title = htmlspecialchars(strip_tags($data->title));
    $content = htmlspecialchars(strip_tags($data->content));
    $category = isset($data->category) ? $data->category : 'Uncategorized';
    $platform = isset($data->platform) ? $data->platform : 'General';
    $is_public = isset($data->is_public) ? $data->is_public : 0;

    $stmt->bindParam(":user_id", $data->user_id);
    $stmt->bindParam(":title", $title);
    $stmt->bindParam(":description", $data->description);
    $stmt->bindParam(":example_output", $data->example_output);
    $stmt->bindParam(":content", $content);
    $stmt->bindParam(":category", $category);
    $stmt->bindParam(":platform", $platform);
    $stmt->bindParam(":is_public", $is_public);
    $stmt->bindParam(":cid", $data->collection_id);

    if ($stmt->execute()) {
        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Prompt berhasil disimpan."]);
    } else {
        http_response_code(503);
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan prompt."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
}
