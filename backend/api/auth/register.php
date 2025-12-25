<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Ambil data JSON
$data = json_decode(file_get_contents("php://input"));

// Validasi Input
if(
    !empty($data->name) &&
    !empty($data->email) &&
    !empty($data->password)
){
    // Cek apakah email sudah ada
    $checkQuery = "SELECT id FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($checkQuery);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();

    if($stmt->rowCount() > 0){
        http_response_code(400); // Bad Request
        echo json_encode(["status" => "error", "message" => "Email sudah terdaftar."]);
        exit();
    }

    // Insert User Baru
    $query = "INSERT INTO users SET name=:name, email=:email, password=:password";
    $stmt = $db->prepare($query);

    // Sanitize & Hash Password
    $name = htmlspecialchars(strip_tags($data->name));
    $email = htmlspecialchars(strip_tags($data->email));
    $password_hash = password_hash($data->password, PASSWORD_BCRYPT);

    $stmt->bindParam(":name", $name);
    $stmt->bindParam(":email", $email);
    $stmt->bindParam(":password", $password_hash);

    if($stmt->execute()){
        http_response_code(201); // Created
        echo json_encode(["status" => "success", "message" => "User berhasil didaftarkan."]);
    } else {
        http_response_code(503); // Server Error
        echo json_encode(["status" => "error", "message" => "Gagal mendaftarkan user."]);
    }
} else {
    http_response_code(400); // Incomplete Data
    echo json_encode(["status" => "error", "message" => "Data tidak lengkap."]);
}
?>