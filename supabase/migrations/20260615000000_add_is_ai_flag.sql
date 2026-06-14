ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_ai boolean NOT NULL DEFAULT false;
ALTER TABLE posts ADD COLUMN IF NOT EXISTS is_ai boolean NOT NULL DEFAULT false;
ALTER TABLE stories ADD COLUMN IF NOT EXISTS is_ai boolean NOT NULL DEFAULT false;
ALTER TABLE story_highlights ADD COLUMN IF NOT EXISTS is_ai boolean NOT NULL DEFAULT false;
ALTER TABLE comments ADD COLUMN IF NOT EXISTS is_ai boolean NOT NULL DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_profiles_is_ai ON profiles(is_ai) WHERE is_ai = true;
CREATE INDEX IF NOT EXISTS idx_posts_is_ai ON posts(is_ai) WHERE is_ai = true;
CREATE INDEX IF NOT EXISTS idx_comments_is_ai ON comments(is_ai) WHERE is_ai = true;
