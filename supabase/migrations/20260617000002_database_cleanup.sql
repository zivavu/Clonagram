-- Phase 2: Database Cleanup
--
-- 2.1: Add UPDATE policies on comments for soft-delete + fix comment count trigger
-- 2.2: Drop duplicate RLS policies
-- 2.3: Restrict notifications INSERT to service_role

-- ============================================================
-- 2.1 Soft-delete comments
-- ============================================================

-- Add UPDATE policies for soft-delete (matching existing DELETE policy semantics)
CREATE POLICY "comments_update_own" ON "public"."comments"
  FOR UPDATE USING (("auth"."uid"() = "user_id"));

CREATE POLICY "comments_update_post_owner" ON "public"."comments"
  FOR UPDATE USING ((EXISTS (
    SELECT 1 FROM "public"."posts"
    WHERE (("posts"."id" = "comments"."post_id") AND ("posts"."user_id" = "auth"."uid"()))
  )));

-- Update comment count trigger to handle UPDATE OF is_deleted
CREATE OR REPLACE FUNCTION "public"."update_post_comment_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.is_deleted IS DISTINCT FROM NEW.is_deleted THEN
    IF NEW.is_deleted THEN
      UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = NEW.post_id;
    ELSE
      UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
    END IF;
  END IF;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS "trg_update_post_comment_count" ON "public"."comments";
CREATE TRIGGER "trg_update_post_comment_count"
  AFTER INSERT OR DELETE OR UPDATE OF "is_deleted" ON "public"."comments"
  FOR EACH ROW EXECUTE FUNCTION "public"."update_post_comment_count"();

-- ============================================================
-- 2.2 Drop duplicate RLS policies
-- ============================================================

-- stories: drop _delete and _insert (keep _delete_own, _insert_own)
DROP POLICY IF EXISTS "stories_delete" ON "public"."stories";
DROP POLICY IF EXISTS "stories_insert" ON "public"."stories";

-- story_images: drop _delete, _insert, _select (keep _delete_own, _insert_own, _select_all)
DROP POLICY IF EXISTS "story_images_delete" ON "public"."story_images";
DROP POLICY IF EXISTS "story_images_insert" ON "public"."story_images";
DROP POLICY IF EXISTS "story_images_select" ON "public"."story_images";

-- story_videos: drop _delete, _insert, _select (keep _delete_own, _insert_own, _select_all)
DROP POLICY IF EXISTS "story_videos_delete" ON "public"."story_videos";
DROP POLICY IF EXISTS "story_videos_insert" ON "public"."story_videos";
DROP POLICY IF EXISTS "story_videos_select" ON "public"."story_videos";

-- story_reactions: drop _delete, _insert, _select (keep _delete_own, _insert_own, _select_owner)
DROP POLICY IF EXISTS "story_reactions_delete" ON "public"."story_reactions";
DROP POLICY IF EXISTS "story_reactions_insert" ON "public"."story_reactions";
DROP POLICY IF EXISTS "story_reactions_select" ON "public"."story_reactions";

-- story_views: drop _select (keep _select_owner)
DROP POLICY IF EXISTS "story_views_select" ON "public"."story_views";

-- ============================================================
-- 2.3 Restrict notifications INSERT to service_role
--     All notification inserts happen via SECURITY DEFINER triggers,
--     so the existing permissive INSERT policy is never exercised.
-- ============================================================

DROP POLICY IF EXISTS "notifications_insert_system" ON "public"."notifications";

-- Also restrict handle_message_insert to service_role since it only
-- does denormalization on conversations (no direct notification insert)
REVOKE ALL ON FUNCTION "public"."handle_message_insert"() FROM "anon", "authenticated";
GRANT ALL ON FUNCTION "public"."handle_message_insert"() TO "service_role";
