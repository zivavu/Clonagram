-- 20260617000002_database_cleanup dropped "story_views_select" as a duplicate of
-- "story_views_select_owner", but the dropped policy also granted viewers SELECT on
-- their own rows. PostgREST's upsert path (ON CONFLICT, used by recordStoryView)
-- needs that grant, so recording a view failed for everyone except the story owner.

DROP POLICY IF EXISTS "story_views_select_own" ON "public"."story_views";

CREATE POLICY "story_views_select_own" ON "public"."story_views"
   FOR SELECT USING ("auth"."uid"() = "viewer_id");
