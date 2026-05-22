<?php
// api/delete_event.php
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->id)) {
    try {
        $conn->beginTransaction();

        // Delete associated bookings first to avoid foreign key constraint errors
        $stmt_bookings = $conn->prepare("DELETE FROM bookings WHERE event_id = :id");
        $stmt_bookings->bindParam(":id", $data->id);
        $stmt_bookings->execute();

        // Delete the event
        $stmt_event = $conn->prepare("DELETE FROM events WHERE id = :id");
        $stmt_event->bindParam(":id", $data->id);
        $stmt_event->execute();

        $conn->commit();

        http_response_code(200);
        echo json_encode(["status" => "success", "message" => "Event deleted successfully."]);
    } catch (PDOException $e) {
        $conn->rollBack();
        http_response_code(503);
        echo json_encode(["status" => "error", "message" => "Unable to delete event: " . $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Event ID is missing."]);
}
?>
