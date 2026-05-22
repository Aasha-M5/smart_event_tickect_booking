<?php
// api/add_event.php
include_once 'config.php';

$data = json_decode(file_get_contents("php://input"));

if (
    !empty($data->name) &&
    !empty($data->department) &&
    !empty($data->date_time) &&
    !empty($data->venue) &&
    isset($data->ticket_price) &&
    isset($data->total_tickets)
) {
    try {
        $query = "INSERT INTO events (name, department, date_time, venue, ticket_price, total_tickets, available_tickets) 
                  VALUES (:name, :department, :date_time, :venue, :ticket_price, :total_tickets, :available_tickets)";
        
        $stmt = $conn->prepare($query);

        $name = htmlspecialchars(strip_tags($data->name));
        $department = htmlspecialchars(strip_tags($data->department));
        $date_time = htmlspecialchars(strip_tags($data->date_time));
        $venue = htmlspecialchars(strip_tags($data->venue));
        $ticket_price = floatval($data->ticket_price);
        $total_tickets = intval($data->total_tickets);

        $stmt->bindParam(":name", $name);
        $stmt->bindParam(":department", $department);
        $stmt->bindParam(":date_time", $date_time);
        $stmt->bindParam(":venue", $venue);
        $stmt->bindParam(":ticket_price", $ticket_price);
        $stmt->bindParam(":total_tickets", $total_tickets);
        $stmt->bindParam(":available_tickets", $total_tickets);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["status" => "success", "message" => "Event created successfully."]);
        } else {
            http_response_code(503);
            echo json_encode(["status" => "error", "message" => "Unable to create event."]);
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
