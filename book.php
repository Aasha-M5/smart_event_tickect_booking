<?php
// api/book.php
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->user_id) && !empty($data->event_id) && !empty($data->number_of_tickets) && !empty($data->total_amount)) {
    try {
        $conn->beginTransaction();

        // 1. Check if enough tickets are available
        $check_query = "SELECT available_tickets FROM events WHERE id = :event_id FOR UPDATE";
        $check_stmt = $conn->prepare($check_query);
        $check_stmt->bindParam(":event_id", $data->event_id);
        $check_stmt->execute();
        
        $row = $check_stmt->fetch(PDO::FETCH_ASSOC);
        
        if (!$row) {
            throw new Exception("Event not found.");
        }
        
        if ($row['available_tickets'] < $data->number_of_tickets) {
            throw new Exception("Not enough tickets available.");
        }

        // 2. Insert booking
        $book_query = "INSERT INTO bookings (user_id, event_id, number_of_tickets, total_amount) VALUES (:user_id, :event_id, :tickets, :amount)";
        $book_stmt = $conn->prepare($book_query);
        $book_stmt->bindParam(":user_id", $data->user_id);
        $book_stmt->bindParam(":event_id", $data->event_id);
        $book_stmt->bindParam(":tickets", $data->number_of_tickets);
        $book_stmt->bindParam(":amount", $data->total_amount);
        $book_stmt->execute();
        $booking_id = $conn->lastInsertId();

        // 3. Update available tickets
        $update_query = "UPDATE events SET available_tickets = available_tickets - :tickets WHERE id = :event_id";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->bindParam(":tickets", $data->number_of_tickets);
        $update_stmt->bindParam(":event_id", $data->event_id);
        $update_stmt->execute();

        $conn->commit();

        http_response_code(201);
        echo json_encode(["status" => "success", "message" => "Booking successful.", "booking_id" => $booking_id]);

    } catch (Exception $e) {
        $conn->rollBack();
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => $e->getMessage()]);
    }
} else {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Incomplete data."]);
}
?>
