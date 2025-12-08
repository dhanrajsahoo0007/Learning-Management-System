-- Migration: Add Clerk User ID support
-- This migration adds clerk_user_id columns to user-related tables
-- and creates necessary indexes for performance

-- 1. Add clerk_user_id to users table
ALTER TABLE users ADD COLUMN clerk_user_id TEXT;

-- 2. Create index on clerk_user_id for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_user_id);

-- 3. Add clerk_user_id to user_progress table (if exists)
-- This allows tracking progress by Clerk user ID
ALTER TABLE user_progress ADD COLUMN clerk_user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_user_progress_clerk_id ON user_progress(clerk_user_id);

-- 4. Add clerk_user_id to achievements table (if exists)
ALTER TABLE achievements ADD COLUMN clerk_user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_achievements_clerk_id ON achievements(clerk_user_id);

-- 5. Add clerk_user_id to user_streaks table (if exists)
ALTER TABLE user_streaks ADD COLUMN clerk_user_id TEXT;
CREATE INDEX IF NOT EXISTS idx_user_streaks_clerk_id ON user_streaks(clerk_user_id);

-- Note: The old 'id' column is kept for backward compatibility
-- You can migrate existing users by mapping their old IDs to Clerk IDs
-- or create a data migration script separately

-- Example data migration (commented out - run separately if needed):
-- UPDATE users SET clerk_user_id = 'clerk_' || id WHERE clerk_user_id IS NULL;
