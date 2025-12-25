<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->name) && !empty($data->email)){
    $query = "UPDATE users SET name = :name, email = :email WHERE id = :id";
    $stmt = $db->prepare($query);

    $name = htmlspecialchars(strip_tags($data->name));
    $email = htmlspecialchars(strip_tags($data->email));

    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":id", $data->id);

    if($stmt->execute()){
        echo json_encode([
            "status" => "success", 
            "message" => "Profil diperbarui.",
            "data" => ["id" => $data->id, "name" => $name, "email" => $email]
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal update."]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
}
?>