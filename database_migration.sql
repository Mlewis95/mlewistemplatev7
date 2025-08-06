-- Migration to add new columns to pets table
-- Run these commands in your Supabase SQL Editor

-- Add the new columns to the pets table
ALTER TABLE pets ADD COLUMN IF NOT EXISTS age_category VARCHAR(10) CHECK (age_category IN ('puppy','adult','senior'));
ALTER TABLE pets ADD COLUMN IF NOT EXISTS size VARCHAR(10) CHECK (size IN ('small','medium','large'));
ALTER TABLE pets ADD COLUMN IF NOT EXISTS gender VARCHAR(10) CHECK (gender IN ('male','female'));
ALTER TABLE pets ADD COLUMN IF NOT EXISTS good_with_kids BOOLEAN DEFAULT FALSE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS good_with_dogs BOOLEAN DEFAULT FALSE;
ALTER TABLE pets ADD COLUMN IF NOT EXISTS good_with_cats BOOLEAN DEFAULT FALSE;

-- Update existing pets with sample data (optional)
UPDATE pets SET 
  age_category = 'adult',
  size = 'medium',
  gender = 'male',
  good_with_kids = true,
  good_with_dogs = true,
  good_with_cats = false
WHERE age_category IS NULL;

-- Verify the columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'pets' 
ORDER BY ordinal_position; 