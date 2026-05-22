<?php
// api/update_avatar_url.php
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id) && !empty($data->avatar_url)) {
    try {
        $query = "UPDATE users SET avatar_url = :avatar_url WHERE id = :id";
        $stmt = $conn->prepare($query);
        
        $id = intval($data->id);
        $avatar_url = htmlspecialchars(strip_tags($data->avatar_url));

        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":avatar_url", $avatar_url);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Avatar updated."]);
        } else {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Unable to update avatar."]);
        }
    } catch (PDOException $e) {
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data."]);
}
?>
