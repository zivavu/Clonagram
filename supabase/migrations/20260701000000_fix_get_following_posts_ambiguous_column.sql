-- get_following_posts had a parameter named follower_id colliding with the
-- follows.follower_id column, causing "column reference is ambiguous" errors
-- under plpgsql.variable_conflict = error, breaking the following feed entirely.
CREATE OR REPLACE FUNCTION "public"."get_following_posts"("p_follower_id" "uuid", "before_cursor" timestamp with time zone DEFAULT NULL::timestamp with time zone, "page_size" integer DEFAULT 10) RETURNS TABLE("id" "uuid", "created_at" timestamp with time zone)
    LANGUAGE "plpgsql" STABLE
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF p_follower_id <> auth.uid() THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  IF page_size IS NULL OR page_size < 1 OR page_size > 100 THEN
    page_size := 10;
  END IF;
  RETURN QUERY
    SELECT p.id, p.created_at
    FROM public.posts p
    JOIN public.follows f ON f.following_id = p.user_id
    WHERE f.follower_id = p_follower_id
      AND p.created_at < COALESCE(before_cursor, now())
    ORDER BY p.created_at DESC
    LIMIT page_size;
END;
$$;
