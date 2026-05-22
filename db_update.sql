USE ticket_booking_system;

-- Add role column if it doesn't exist (MySQL syntax workaround for IF NOT EXISTS on columns is complex, so we'll just run ALTER and ignore if it fails, but better to check)
-- Actually, it's easier to just run ALTER TABLE. If it's already there, it errors, which is fine.
ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user';

-- Insert default admin user. Password is 'admin' hashed with BCRYPT.
-- Note: PHP password_hash('admin', PASSWORD_BCRYPT) gives something like $2y$10$...
-- We can just use a pre-hashed string for 'admin'
-- $2y$10$vPZ5O3E/iIeI0iP5z0r1/uq20J.1a01uQ94X8Xj3eF3f5XpX3iF3y => this is not real
-- I will just create a quick PHP script to insert the admin to ensure proper hashing.
