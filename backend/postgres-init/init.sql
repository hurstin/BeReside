-- Enable the UUID extension for generating random secure identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- --- USERS TABLE ---
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) DEFAULT 'guest' CHECK (role IN ('guest', 'admin', 'staff')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --- ROOMS TABLE ---
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    room_number VARCHAR(10) UNIQUE NOT NULL,
    type VARCHAR(30) NOT NULL CHECK (type IN ('family', 'double', 'queen', 'apartment')),
    base_price_per_night NUMERIC(10, 2) NOT NULL CHECK (base_price_per_night > 0),
    status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'occupied')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- --- BOOKINGS TABLE ---
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_price NUMERIC(10, 2) NOT NULL CHECK (total_price >= 0),
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    booking_status VARCHAR(20) DEFAULT 'confirmed' CHECK (booking_status IN ('confirmed', 'cancelled', 'completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Ensure the check-out date is logically after the check-in date
    CONSTRAINT check_booking_dates CHECK (check_out_date > check_in_date)
);

-- --- INDEXES FOR PERFORMANCE OPTIMIZATION ---
-- Accelerates user lookups during authentication
CREATE INDEX idx_users_email ON users(email);

-- Crucial composite index for rapid availability verification queries
CREATE INDEX idx_bookings_room_date ON bookings(room_id, check_in_date, check_out_date);

-- Speeds up relational dashboard lookups for a single customer's profile history
CREATE INDEX idx_bookings_user ON bookings(user_id);
