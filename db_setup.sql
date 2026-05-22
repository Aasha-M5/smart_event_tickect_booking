CREATE DATABASE IF NOT EXISTS ticket_booking_system;
USE ticket_booking_system;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100) NOT NULL,
    date_time DATETIME NOT NULL,
    venue VARCHAR(255) NOT NULL,
    ticket_price DECIMAL(10, 2) NOT NULL,
    total_tickets INT NOT NULL,
    available_tickets INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    event_id INT NOT NULL,
    number_of_tickets INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

INSERT INTO events (name, department, date_time, venue, ticket_price, total_tickets, available_tickets)
SELECT * FROM (SELECT 'Tech Symposium 2026' as name, 'Computer Science' as dept, '2026-06-15 09:00:00' as dt, 'Main Auditorium' as venue, 250.00 as price, 200 as total, 200 as avail) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM events WHERE name = 'Tech Symposium 2026'
) LIMIT 1;

INSERT INTO events (name, department, date_time, venue, ticket_price, total_tickets, available_tickets)
SELECT * FROM (SELECT 'Robotics Workshop' as name, 'Electronics' as dept, '2026-06-20 10:00:00' as dt, 'Lab 3B' as venue, 150.00 as price, 50 as total, 50 as avail) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM events WHERE name = 'Robotics Workshop'
) LIMIT 1;

INSERT INTO events (name, department, date_time, venue, ticket_price, total_tickets, available_tickets)
SELECT * FROM (SELECT 'AI Seminar' as name, 'Information Technology' as dept, '2026-07-05 14:00:00' as dt, 'Conference Hall' as venue, 100.00 as price, 100 as total, 100 as avail) AS tmp
WHERE NOT EXISTS (
    SELECT name FROM events WHERE name = 'AI Seminar'
) LIMIT 1;
