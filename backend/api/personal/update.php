<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->user_id)) {

    $query = "UPDATE prompts 
          SET title=:title, description=:description, 
              content=:content, example_output=:example_output,
              category=:category, platform=:platform, is_public=:is_public 
          WHERE id=:id AND user_id=:user_id";

    $stmt = $db->prepare($query);

    $stmt->bindParam(":title", $data->title);
    $stmt->bindParam(":description", $data->description);
    $stmt->bindParam(":example_output", $data->example_output);
    $stmt->bindParam(":content", $data->content);
    $stmt->bindParam(":category", $data->category);
    $stmt->bindParam(":platform", $data->platform);
    $stmt->bindParam(":is_public", $data->is_public);
    $stmt->bindParam(":id", $data->id);
    $stmt->bindParam(":user_id", $data->user_id);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Prompt berhasil diupdate."]);
    } else {
        http_response_code(503);
        echo json_encode(["status" => "error", "message" => "Gagal update."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "ID tidak valid."]);
}
