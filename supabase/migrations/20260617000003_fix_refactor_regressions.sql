-- Fix regressions introduced by the Phase 2 database cleanup migration.

-- 1. Re-grant EXECUTE on handle_message_insert to authenticated users.
--    The function is invoked by a trigger on message inserts; revoking it broke DMs.
GRANT ALL ON FUNCTION "public"."handle_message_insert"() TO "authenticated";


-- 2. Restore notifications INSERT policy for authenticated users.
--    sendStoryMessage inserts notifications directly as the authenticated user.
DROP POLICY IF EXISTS "notifications_insert_system" ON "public"."notifications";
CREATE POLICY "notifications_insert_system" ON "public"."notifications"
  FOR INSERT WITH CHECK (("auth"."uid"() = "actor_id"));


-- 3. Replace overly permissive comments UPDATE policies and enforce soft-delete-only.
DROP POLICY IF EXISTS "comments_update_own" ON "public"."comments";
DROP POLICY IF EXISTS "comments_update_post_owner" ON "public"."comments";

CREATE POLICY "comments_update_own_soft_delete" ON "public"."comments"
  FOR UPDATE USING (("auth"."uid"() = "user_id"))
  WITH CHECK (("auth"."uid"() = "user_id") AND ("is_deleted" = true));

CREATE POLICY "comments_update_post_owner_soft_delete" ON "public"."comments"
  FOR UPDATE USING ((EXISTS (
    SELECT 1 FROM "public"."posts"
    WHERE (("posts"."id" = "comments"."post_id") AND ("posts"."user_id" = "auth"."uid"()))
  )))
  WITH CHECK ((EXISTS (
    SELECT 1 FROM "public"."posts"
    WHERE (("posts"."id" = "comments"."post_id") AND ("posts"."user_id" = "auth"."uid"()))
  )) AND ("is_deleted" = true));

CREATE OR REPLACE FUNCTION "public"."enforce_comment_soft_delete"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.is_deleted IS DISTINCT FROM OLD.is_deleted THEN
    IF OLD.is_deleted = true OR NEW.is_deleted = false THEN
      RAISE EXCEPTION 'Comments can only be soft-deleted';
    END IF;
  ELSE
    RAISE EXCEPTION 'Only soft-delete is allowed on comments';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS "enforce_comment_soft_delete" ON "public"."comments";
CREATE TRIGGER "enforce_comment_soft_delete"
  BEFORE UPDATE ON "public"."comments"
  FOR EACH ROW EXECUTE FUNCTION "public"."enforce_comment_soft_delete"();


-- 4. Clamp get_following_posts page_size to a reasonable range.
CREATE OR REPLACE FUNCTION "public"."get_following_posts"("follower_id" "uuid", "before_cursor" timestamp with time zone DEFAULT NULL::timestamp with time zone, "page_size" integer DEFAULT 10) RETURNS TABLE("id" "uuid", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF follower_id <> auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  IF page_size IS NULL OR page_size < 1 OR page_size > 100 THEN
    page_size := 10;
  END IF;
  RETURN QUERY
    SELECT p.id, p.created_at
    FROM public.posts p
    JOIN public.follows f ON f.following_id = p.user_id
    WHERE f.follower_id = follower_id
      AND p.created_at < COALESCE(before_cursor, now())
    ORDER BY p.created_at DESC
    LIMIT page_size;
END;
$$;
