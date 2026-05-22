<?php
// api/register.php
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->name) && !empty($data->email) && !empty($data->password)) {
    try {
        $query = "INSERT INTO users (name, email, password, department) VALUES (:name, :email, :password, :department)";
        $stmt = $conn->prepare($query);

        $name = htmlspecialchars(strip_tags($data->name));
        $email = htmlspecialchars(strip_tags($data->email));
        $password = password_hash($data->password, PASSWORD_BCRYPT);
        $department = isset($data->department) ? htmlspecialchars(strip_tags($data->department)) : null;

        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":email", $email);
        $stmt->bindParam(":password", $password);
        $stmt->bindParam(":department", $department);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "User was registered."]);
        } else {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Unable to register user."]);
        }
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Email already exists or invalid data."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data."]);
}
?>
