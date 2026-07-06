-- Soft-deleting a comment (UPDATE is_deleted = true) was always rejected by RLS:
-- Postgres requires the post-update row to still satisfy an applicable SELECT
-- policy, and comments_select_all (USING NOT is_deleted) always failed for the
-- new row. Let the comment's author and the post owner keep visibility of their
-- own comments even once soft-deleted, mirroring the existing update/delete rules.

CREATE POLICY "comments_select_own_regardless" ON "public"."comments"
  FOR SELECT USING (("auth"."uid"() = "user_id"));

CREATE POLICY "comments_select_post_owner_regardless" ON "public"."comments"
  FOR SELECT USING ((EXISTS (
    SELECT 1 FROM "public"."posts"
    WHERE (("posts"."id" = "comments"."post_id") AND ("posts"."user_id" = "auth"."uid"()))
  )));
