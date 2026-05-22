<?php
// api/update_event.php
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->id) &&
    !empty($data->name) &&
    !empty($data->department) &&
    !empty($data->date_time) &&
    !empty($data->venue) &&
    isset($data->ticket_price) &&
    isset($data->total_tickets) &&
    isset($data->available_tickets)
) {
    try {
        $query = "UPDATE events SET 
                    name = :name, 
                    department = :department, 
                    date_time = :date_time, 
                    venue = :venue, 
                    ticket_price = :ticket_price, 
                    total_tickets = :total_tickets,
                    available_tickets = :available_tickets
                  WHERE id = :id";
        
        $stmt = $conn->prepare($query);

        $id = intval($data->id);
        $name = htmlspecialchars(strip_tags($data->name));
        $department = htmlspecialchars(strip_tags($data->department));
        $date_time = htmlspecialchars(strip_tags($data->date_time));
        $venue = htmlspecialchars(strip_tags($data->venue));
        $ticket_price = floatval($data->ticket_price);
        $total_tickets = intval($data->total_tickets);
        $available_tickets = intval($data->available_tickets);

        $stmt->bindParam(":id", $id);
        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":department", $department);
        $stmt->bindParam(":date_time", $date_time);
        $stmt->bindParam(":venue", $venue);
        $stmt->bindParam(":ticket_price", $ticket_price);
        $stmt->bindParam(":total_tickets", $total_tickets);
        $stmt->bindParam(":available_tickets", $available_tickets);

        if ($stmt->execute()) {
            http_response_code(200);
            echo json_encode(["status" => "success", "message" => "Event updated successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Unable to update event."]);
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
