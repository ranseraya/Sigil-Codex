<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(200);
    exit();
}

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!isset($data->id)) {
    echo json_encode(["status" => "error", "message" => "ID Collection diperlukan"]);
    exit();
}

$collection_id = intval($data->id);

try {
    $checkQuery = "SELECT id FROM collections WHERE id = :id";
    $stmt = $db->prepare($checkQuery);
    $stmt->bindParam(':id', $collection_id);
    $stmt->execute();

    if ($stmt->rowCount() === 0) {
        echo json_encode(["status" => "error", "message" => "Folder tidak ditemukan."]);
        exit();
    }

    $updateQuery = "UPDATE prompts SET collection_id = NULL WHERE collection_id = :id";
    $stmtUpdate = $db->prepare($updateQuery);
    $stmtUpdate->bindParam(':id', $collection_id);
    $stmtUpdate->execute();

    $deleteQuery = "DELETE FROM collections WHERE id = :id";
    $stmtDelete = $db->prepare($deleteQuery);
    $stmtDelete->bindParam(':id', $collection_id);
    
    if ($stmtDelete->execute()) {
        echo json_encode(["status" => "success", "message" => "Folder berhasil dihapus."]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menghapus folder."]);
    }

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database Error: " . $e->getMessage()]);
}
?>