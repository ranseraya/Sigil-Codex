<?php
include_once '../../config/cors.php';
include_once '../../config/database.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->email) && !empty($data->password)){
    $query = "SELECT id, name, password FROM users WHERE email = :email LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(':email', $data->email);
    $stmt->execute();

    if($stmt->rowCount() > 0){
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if(password_verify($data->password, $row['password'])){
            
            $user_data = [
                "id" => $row['id'],
                "name" => $row['name'],
                "email" => $data->email
            ];

            http_response_code(200);
            echo json_encode([
                "status" => "success",
                "message" => "Login berhasil.",
                "data" => $user_data
            ]);
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(["status" => "error", "message" => "Password salah."]);
        }
    } else {
        http_response_code(404); // User not found
        echo json_encode(["status" => "error", "message" => "Email tidak ditemukan."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Email dan Password wajib diisi."]);
}
?>