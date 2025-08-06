-- ========================
-- Animal Shelter Volunteer Database
-- PostgreSQL SQL Script
-- ========================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop tables if they already exist (to reset)
DROP TABLE IF EXISTS comments CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS dog_walks CASCADE;
DROP TABLE IF EXISTS volunteer_time CASCADE;
DROP TABLE IF EXISTS orientation_schedule CASCADE;
DROP TABLE IF EXISTS pets CASCADE;
DROP TABLE IF EXISTS user_training CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ========================
-- USERS TABLE
-- ========================
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) CHECK (role IN ('volunteer', 'manager')) NOT NULL DEFAULT 'volunteer',
    orientation_completed BOOLEAN NOT NULL DEFAULT FALSE,
    total_hours NUMERIC(6,2) DEFAULT 0,
    profile_photo_url TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- TRAINING LEVELS (Join Table)
-- ========================
CREATE TABLE user_training (
    training_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    training_level VARCHAR(10) CHECK (training_level IN ('Green','Yellow','Blue','Red','Black')) NOT NULL
);

-- ========================
-- VOLUNTEER TIME LOGS
-- ========================
CREATE TABLE volunteer_time (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    sign_in_time TIMESTAMP NOT NULL,
    sign_out_time TIMESTAMP
);

-- ========================
-- PETS
-- ========================
CREATE TABLE pets (
    pet_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    species VARCHAR(10) CHECK (species IN ('dog','cat')) NOT NULL,
    training_level VARCHAR(10) CHECK (training_level IN ('Green','Yellow','Blue','Red','Black')) NOT NULL,
    is_fosterable BOOLEAN NOT NULL DEFAULT FALSE,
    photo_url TEXT,
    notes TEXT,
    entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
    age_category VARCHAR(10) CHECK (age_category IN ('puppy','adult','senior')),
    size VARCHAR(10) CHECK (size IN ('small','medium','large')),
    gender VARCHAR(10) CHECK (gender IN ('male','female')),
    good_with_kids BOOLEAN DEFAULT FALSE,
    good_with_dogs BOOLEAN DEFAULT FALSE,
    good_with_cats BOOLEAN DEFAULT FALSE
);

-- ========================
-- DOG WALKS
-- ========================
CREATE TABLE dog_walks (
    walk_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
    dog_id UUID REFERENCES pets(pet_id) ON DELETE CASCADE,
    walk_date DATE NOT NULL,
    time_start TIME NOT NULL,
    duration INTERVAL NOT NULL,
    notes TEXT
);

-- ========================
-- TASKS
-- ========================
CREATE TABLE tasks (
    task_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    description TEXT,
    priority INT CHECK (priority BETWEEN 1 AND 5) DEFAULT 3,
    notes TEXT,
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- ========================
-- MESSAGES (Announcements)
-- ========================
CREATE TABLE messages (
    message_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content TEXT NOT NULL,
    posted_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- ========================
-- COMMENTS ON MESSAGES
-- ========================
CREATE TABLE comments (
    comment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES messages(message_id) ON DELETE CASCADE,
    posted_by UUID REFERENCES users(user_id) ON DELETE SET NULL,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT NOW()
);

-- ========================
-- ORIENTATION SCHEDULE
-- ========================
CREATE TABLE orientation_schedule (
    schedule_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    time TIME NOT NULL,
    max_participants INT NOT NULL CHECK (max_participants > 0),
    created_by UUID REFERENCES users(user_id) ON DELETE SET NULL
);

-- ========================
-- INDEXES FOR PERFORMANCE
-- ========================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_pets_species ON pets(species);
CREATE INDEX idx_dog_walks_user_id ON dog_walks(user_id);
CREATE INDEX idx_dog_walks_dog_id ON dog_walks(dog_id);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_messages_timestamp ON messages(timestamp);

-- ========================
-- MOCK DATA
-- ========================

-- Insert Users (with explicit UUIDs for reference)
INSERT INTO users (user_id, name, email, password_hash, role, orientation_completed, total_hours, profile_photo_url) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Morgan Lewis', 'morgan.lewis@email.com', 'password123', 'manager', true, 45.5, 'https://example.com/morgan.jpg'),
('550e8400-e29b-41d4-a716-446655440002', 'Sarah Johnson', 'sarah.johnson@email.com', 'password123', 'volunteer', true, 32.0, 'https://example.com/sarah.jpg'),
('550e8400-e29b-41d4-a716-446655440003', 'Mike Chen', 'mike.chen@email.com', 'password123', 'volunteer', true, 28.5, 'https://example.com/mike.jpg'),
('550e8400-e29b-41d4-a716-446655440004', 'Emily Davis', 'emily.davis@email.com', 'password123', 'volunteer', false, 0.0, NULL),
('550e8400-e29b-41d4-a716-446655440005', 'David Wilson', 'david.wilson@email.com', 'password123', 'volunteer', true, 15.0, 'https://example.com/david.jpg'),
('550e8400-e29b-41d4-a716-446655440006', 'Lisa Thompson', 'lisa.thompson@email.com', 'password123', 'volunteer', true, 22.5, 'https://example.com/lisa.jpg'),
('550e8400-e29b-41d4-a716-446655440007', 'James Brown', 'james.brown@email.com', 'password123', 'volunteer', true, 18.0, 'https://example.com/james.jpg'),
('550e8400-e29b-41d4-a716-446655440008', 'Amanda Garcia', 'amanda.garcia@email.com', 'password123', 'volunteer', false, 0.0, NULL);

-- Insert User Training Levels
INSERT INTO user_training (user_id, training_level) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Black'),  -- Morgan Lewis (manager)
('550e8400-e29b-41d4-a716-446655440002', 'Blue'),   -- Sarah Johnson
('550e8400-e29b-41d4-a716-446655440003', 'Yellow'), -- Mike Chen
('550e8400-e29b-41d4-a716-446655440005', 'Green'),  -- David Wilson
('550e8400-e29b-41d4-a716-446655440006', 'Blue'),   -- Lisa Thompson
('550e8400-e29b-41d4-a716-446655440007', 'Yellow'); -- James Brown

-- Insert Pets (with explicit UUIDs for reference)
INSERT INTO pets (pet_id, name, species, training_level, is_fosterable, photo_url, notes, age_category, size, gender, good_with_kids, good_with_dogs, good_with_cats) VALUES
-- Dogs
('660e8400-e29b-41d4-a716-446655440001', 'Bella', 'dog', 'Green', true, 'https://example.com/bella.jpg', 'Friendly golden retriever, great with kids', 'adult', 'large', 'female', true, true, false),
('660e8400-e29b-41d4-a716-446655440002', 'Buddy', 'dog', 'Yellow', false, 'https://example.com/buddy.jpg', 'Energetic border collie, needs active family', 'adult', 'medium', 'male', true, true, false),
('660e8400-e29b-41d4-a716-446655440003', 'Daisy', 'dog', 'Blue', true, 'https://example.com/daisy.jpg', 'Sweet lab mix, loves to play fetch', 'adult', 'large', 'female', true, true, true),
('660e8400-e29b-41d4-a716-446655440004', 'Luna', 'dog', 'Red', false, 'https://example.com/luna.jpg', 'Shy but gentle, needs patient owner', 'adult', 'medium', 'female', false, false, false),
('660e8400-e29b-41d4-a716-446655440005', 'Max', 'dog', 'Green', true, 'https://example.com/max.jpg', 'Playful puppy, learning basic commands', 'puppy', 'medium', 'male', true, true, false),
('660e8400-e29b-41d4-a716-446655440006', 'Rocky', 'dog', 'Black', false, 'https://example.com/rocky.jpg', 'Senior dog, calm and loving', 'senior', 'large', 'male', true, true, true),
('660e8400-e29b-41d4-a716-446655440007', 'Winston', 'dog', 'Yellow', true, 'https://example.com/winston.jpg', 'Smart poodle mix, house trained', 'adult', 'small', 'male', true, true, true),
('660e8400-e29b-41d4-a716-446655440008', 'Charlie', 'dog', 'Blue', false, 'https://example.com/charlie.jpg', 'Active husky, needs lots of exercise', 'adult', 'large', 'male', false, false, false),

-- Cats
('660e8400-e29b-41d4-a716-446655440009', 'Whiskers', 'cat', 'Green', true, 'https://example.com/whiskers.jpg', 'Gentle tabby, loves to cuddle', 'adult', 'medium', 'male', true, false, true),
('660e8400-e29b-41d4-a716-446655440010', 'Shadow', 'cat', 'Yellow', false, 'https://example.com/shadow.jpg', 'Shy black cat, needs quiet home', 'adult', 'small', 'female', false, false, false),
('660e8400-e29b-41d4-a716-446655440011', 'Mittens', 'cat', 'Blue', true, 'https://example.com/mittens.jpg', 'Playful kitten, good with other cats', 'puppy', 'small', 'female', true, false, true),
('660e8400-e29b-41d4-a716-446655440012', 'Fluffy', 'cat', 'Green', false, 'https://example.com/fluffy.jpg', 'Senior cat, very affectionate', 'senior', 'medium', 'female', true, false, true),
('660e8400-e29b-41d4-a716-446655440013', 'Tiger', 'cat', 'Yellow', true, 'https://example.com/tiger.jpg', 'Orange tabby, loves to explore', 'adult', 'medium', 'male', true, false, true),
('660e8400-e29b-41d4-a716-446655440014', 'Smokey', 'cat', 'Blue', false, 'https://example.com/smokey.jpg', 'Gray cat, independent personality', 'adult', 'medium', 'male', false, false, false);

-- Insert Tasks
INSERT INTO tasks (title, description, priority, notes, created_by, created_at) VALUES
('Dog Enrichment', 'Provide mental stimulation activities for dogs in kennels', 1, 'Use puzzle toys and training exercises', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 days'),
('Cat Enrichment', 'Play with cats and provide interactive toys', 2, 'Focus on socialization and exercise', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day'),
('Food Pantry Organization', 'Sort and organize donated pet food', 3, 'Check expiration dates and categorize by type', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 days'),
('Dish Room Cleanup', 'Clean and sanitize all food and water bowls', 1, 'Use proper cleaning protocols', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day'),
('Laundry Room Maintenance', 'Wash and fold towels, blankets, and bedding', 2, 'Separate by color and fabric type', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 days'),
('Laundry Processing', 'Wash and dry all shelter linens', 3, 'Use hot water and appropriate detergents', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day'),
('Sorting Donations', 'Organize incoming donations by category', 4, 'Check for damaged or expired items', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 days'),
('Adoption Bags Preparation', 'Prepare welcome bags for new adopters', 2, 'Include care instructions and samples', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day'),
('Foster Bags Assembly', 'Create care packages for foster families', 3, 'Include food, toys, and medical info', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 days'),
('Kennel Cleaning', 'Deep clean all dog kennels and runs', 1, 'Use disinfectant and allow proper drying time', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day');

-- Insert Messages (with explicit UUIDs for reference)
INSERT INTO messages (message_id, content, posted_by, timestamp) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'Welcome to all new volunteers! Please attend orientation this Saturday at 10 AM.', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '5 days'),
('770e8400-e29b-41d4-a716-446655440002', 'Great job everyone on the adoption event last weekend! We found homes for 8 pets!', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 days'),
('770e8400-e29b-41d4-a716-446655440003', 'Reminder: Please sign in and out when volunteering. This helps us track hours accurately.', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 days'),
('770e8400-e29b-41d4-a716-446655440004', 'We have new training materials available. Check with Morgan if you need to update your certification.', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day'),
('770e8400-e29b-41d4-a716-446655440005', 'Thank you to everyone who helped with the emergency intake last night. You all did amazing!', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '12 hours');

-- Insert Comments
INSERT INTO comments (comment_id, message_id, posted_by, content, timestamp) VALUES
('880e8400-e29b-41d4-a716-446655440001', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', 'Looking forward to meeting everyone!', NOW() - INTERVAL '4 days'),
('880e8400-e29b-41d4-a716-446655440002', '770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440003', 'Will there be coffee? 😊', NOW() - INTERVAL '4 days'),
('880e8400-e29b-41d4-a716-446655440003', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440005', 'So happy to be part of this success!', NOW() - INTERVAL '2 days'),
('880e8400-e29b-41d4-a716-446655440004', '770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440006', 'The families were so excited to meet their new pets!', NOW() - INTERVAL '2 days'),
('880e8400-e29b-41d4-a716-446655440005', '770e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440007', 'I always forget to sign out. Thanks for the reminder!', NOW() - INTERVAL '1 day'),
('880e8400-e29b-41d4-a716-446655440006', '770e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', 'I need to update my training. When is Morgan available?', NOW() - INTERVAL '1 day'),
('880e8400-e29b-41d4-a716-446655440007', '770e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440003', 'It was a long night but worth it to help those animals!', NOW() - INTERVAL '11 hours');

-- Insert Volunteer Time Logs
INSERT INTO volunteer_time (log_id, user_id, sign_in_time, sign_out_time) VALUES
('990e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '3 days 2 hours', NOW() - INTERVAL '3 days 5 hours'),
('990e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '2 days 1 hour', NOW() - INTERVAL '2 days 4 hours'),
('990e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440001', NOW() - INTERVAL '1 day 3 hours', NOW() - INTERVAL '1 day 6 hours'),
('990e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '3 days 3 hours', NOW() - INTERVAL '3 days 6 hours'),
('990e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '2 days 2 hours', NOW() - INTERVAL '2 days 5 hours'),
('990e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440002', NOW() - INTERVAL '1 day 1 hour', NOW() - INTERVAL '1 day 4 hours'),
('990e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '3 days 4 hours', NOW() - INTERVAL '3 days 7 hours'),
('990e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440003', NOW() - INTERVAL '2 days 3 hours', NOW() - INTERVAL '2 days 6 hours'),
('990e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '2 days 4 hours', NOW() - INTERVAL '2 days 7 hours'),
('990e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440005', NOW() - INTERVAL '1 day 2 hours', NOW() - INTERVAL '1 day 5 hours'),
('990e8400-e29b-41d4-a716-446655440011', '550e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '3 days 5 hours', NOW() - INTERVAL '3 days 8 hours'),
('990e8400-e29b-41d4-a716-446655440012', '550e8400-e29b-41d4-a716-446655440006', NOW() - INTERVAL '2 days 5 hours', NOW() - INTERVAL '2 days 8 hours'),
('990e8400-e29b-41d4-a716-446655440013', '550e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '2 days 6 hours', NOW() - INTERVAL '2 days 9 hours'),
('990e8400-e29b-41d4-a716-446655440014', '550e8400-e29b-41d4-a716-446655440007', NOW() - INTERVAL '1 day 4 hours', NOW() - INTERVAL '1 day 7 hours');

-- Insert Dog Walks
INSERT INTO dog_walks (walk_id, user_id, dog_id, walk_date, time_start, duration) VALUES
('aa0e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '3 days', '09:00:00', '30 minutes'),
('aa0e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '3 days', '14:00:00', '45 minutes'),
('aa0e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', CURRENT_DATE - INTERVAL '2 days', '10:00:00', '30 minutes'),
('aa0e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440005', CURRENT_DATE - INTERVAL '2 days', '15:00:00', '20 minutes'),
('aa0e8400-e29b-41d4-a716-446655440005', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440001', CURRENT_DATE - INTERVAL '1 day', '08:00:00', '40 minutes'),
('aa0e8400-e29b-41d4-a716-446655440006', '550e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440007', CURRENT_DATE - INTERVAL '1 day', '13:00:00', '35 minutes'),
('aa0e8400-e29b-41d4-a716-446655440007', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003', CURRENT_DATE - INTERVAL '1 day', '11:00:00', '30 minutes'),
('aa0e8400-e29b-41d4-a716-446655440008', '550e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440008', CURRENT_DATE - INTERVAL '1 day', '16:00:00', '45 minutes'),
('aa0e8400-e29b-41d4-a716-446655440009', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440002', CURRENT_DATE, '09:30:00', '30 minutes'),
('aa0e8400-e29b-41d4-a716-446655440010', '550e8400-e29b-41d4-a716-446655440007', '660e8400-e29b-41d4-a716-446655440004', CURRENT_DATE, '14:30:00', '25 minutes');

-- Insert Orientation Schedules
INSERT INTO orientation_schedule (schedule_id, date, time, max_participants, created_by) VALUES
('bb0e8400-e29b-41d4-a716-446655440001', CURRENT_DATE + INTERVAL '3 days', '10:00:00', 15, '550e8400-e29b-41d4-a716-446655440001'),
('bb0e8400-e29b-41d4-a716-446655440002', CURRENT_DATE + INTERVAL '10 days', '14:00:00', 15, '550e8400-e29b-41d4-a716-446655440001'),
('bb0e8400-e29b-41d4-a716-446655440003', CURRENT_DATE + INTERVAL '17 days', '10:00:00', 15, '550e8400-e29b-41d4-a716-446655440001'),
('bb0e8400-e29b-41d4-a716-446655440004', CURRENT_DATE + INTERVAL '24 days', '14:00:00', 15, '550e8400-e29b-41d4-a716-446655440001');

-- ========================
-- VERIFICATION QUERIES
-- ========================
-- Uncomment these to verify the data was inserted correctly

-- SELECT 'Users' as table_name, COUNT(*) as count FROM users
-- UNION ALL
-- SELECT 'Pets', COUNT(*) FROM pets
-- UNION ALL
-- SELECT 'Tasks', COUNT(*) FROM tasks
-- UNION ALL
-- SELECT 'Messages', COUNT(*) FROM messages
-- UNION ALL
-- SELECT 'Comments', COUNT(*) FROM comments
-- UNION ALL
-- SELECT 'Volunteer Time', COUNT(*) FROM volunteer_time
-- UNION ALL
-- SELECT 'Dog Walks', COUNT(*) FROM dog_walks
-- UNION ALL
-- SELECT 'Orientation Schedules', COUNT(*) FROM orientation_schedule
-- UNION ALL
-- SELECT 'User Training', COUNT(*) FROM user_training;

