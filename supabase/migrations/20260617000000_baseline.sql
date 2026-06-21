


SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE SCHEMA IF NOT EXISTS "public";


ALTER SCHEMA "public" OWNER TO "pg_database_owner";


COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE OR REPLACE FUNCTION "public"."conversation_has_participants"("conv_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conv_id
  );
$$;


ALTER FUNCTION "public"."conversation_has_participants"("conv_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_underpopulated_conversations"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  DELETE FROM conversations
  WHERE id = OLD.conversation_id
    AND (
      SELECT COUNT(*) FROM conversation_participants
      WHERE conversation_id = OLD.conversation_id
    ) < 2;
  RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."delete_underpopulated_conversations"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."delete_user"() RETURNS "void"
    LANGUAGE "sql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  delete from auth.users where id = auth.uid();
$$;


ALTER FUNCTION "public"."delete_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."find_direct_conversation"("p_user_a" "uuid", "p_user_b" "uuid") RETURNS "uuid"
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public'
    AS $$
  SELECT cp1.conversation_id
  FROM conversation_participants cp1
  JOIN conversation_participants cp2
    ON cp1.conversation_id = cp2.conversation_id
  WHERE cp1.user_id = p_user_a
    AND cp2.user_id = p_user_b
    AND (
      SELECT COUNT(*)
      FROM conversation_participants
      WHERE conversation_id = cp1.conversation_id
    ) = 2
  LIMIT 1;
$$;


ALTER FUNCTION "public"."find_direct_conversation"("p_user_a" "uuid", "p_user_b" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_following_posts"("follower_id" "uuid", "before_cursor" timestamp with time zone DEFAULT NULL::timestamp with time zone, "page_size" integer DEFAULT 10) RETURNS TABLE("id" "uuid", "created_at" timestamp with time zone)
    LANGUAGE "sql" STABLE
    SET "search_path" TO 'public'
    AS $$
    SELECT p.id, p.created_at
    FROM public.posts p
    JOIN public.follows f ON f.following_id = p.user_id
    WHERE f.follower_id = follower_id
      AND p.created_at < COALESCE(before_cursor, now())
    ORDER BY p.created_at DESC
    LIMIT page_size;
$$;


ALTER FUNCTION "public"."get_following_posts"("follower_id" "uuid", "before_cursor" timestamp with time zone, "page_size" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_comment_like_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type, comment_id)
  SELECT c.user_id, NEW.user_id, 'like', NEW.comment_id
  FROM comments c
  WHERE c.id = NEW.comment_id AND c.user_id != NEW.user_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_comment_like_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_comment_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type, post_id, comment_id)
  SELECT p.user_id, NEW.user_id, 'comment', NEW.post_id, NEW.id
  FROM posts p
  WHERE p.id = NEW.post_id AND p.user_id != NEW.user_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_comment_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_comment_unlike_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  DELETE FROM notifications
  WHERE type = 'like' AND actor_id = OLD.user_id AND comment_id = OLD.comment_id;
  RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."handle_comment_unlike_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_follow_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type)
  VALUES (NEW.following_id, NEW.follower_id, 'follow');
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_follow_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_like_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type, post_id)
  SELECT p.user_id, NEW.user_id, 'like', NEW.post_id
  FROM posts p
  WHERE p.id = NEW.post_id AND p.user_id != NEW.user_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_like_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_message_insert"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
   preview text;
BEGIN
   IF NEW.content IS NOT NULL THEN
      preview := LEFT(NEW.content, 100);
   ELSIF NEW.audio_url IS NOT NULL THEN
      preview := 'sent a voice message';
   ELSIF NEW.media_url IS NOT NULL THEN
      preview := 'sent a photo';
   ELSIF NEW.sticker_url IS NOT NULL THEN
      preview := 'sent a sticker';
   ELSIF NEW.post_id IS NOT NULL THEN
      preview := 'sent a post';
   ELSIF NEW.call_event = 'audio_started' THEN
      preview := 'started an audio call';
   ELSIF NEW.call_event = 'video_started' THEN
      preview := 'started a video chat';
   ELSIF NEW.call_event = 'audio_ended' THEN
      preview := 'Audio call ended';
   ELSIF NEW.call_event = 'video_ended' THEN
      preview := 'Video chat ended';
   ELSE
      preview := '';
   END IF;

   UPDATE public.conversations
   SET
      last_message_preview = preview,
      last_message_at = NEW.created_at,
      last_message_sender_id = NEW.sender_id,
      updated_at = NEW.created_at
   WHERE id = NEW.conversation_id;

   UPDATE public.conversation_participants
   SET last_message_at = NEW.created_at
   WHERE conversation_id = NEW.conversation_id;

   RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_message_insert"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$begin
  -- skip profile creation for anonymous users
  if new.is_anonymous then
    return new;
  end if;

  insert into public.profiles (id, username, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_story_reaction_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  INSERT INTO notifications (user_id, actor_id, type, story_id)
  SELECT s.user_id, NEW.user_id, 'story_like', NEW.story_id
  FROM stories s
  WHERE s.id = NEW.story_id AND s.user_id != NEW.user_id;
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."handle_story_reaction_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_unfollow_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  DELETE FROM notifications
  WHERE type = 'follow' AND actor_id = OLD.follower_id AND user_id = OLD.following_id;
  RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."handle_unfollow_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_unlike_notification"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  DELETE FROM notifications
  WHERE type = 'like' AND actor_id = OLD.user_id AND post_id = OLD.post_id AND comment_id IS NULL;
  RETURN OLD;
END;
$$;


ALTER FUNCTION "public"."handle_unlike_notification"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."is_conversation_participant"("conv_id" "uuid") RETURNS boolean
    LANGUAGE "sql" STABLE SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
  SELECT EXISTS (
    SELECT 1 FROM conversation_participants
    WHERE conversation_id = conv_id AND user_id = auth.uid()
  );
$$;


ALTER FUNCTION "public"."is_conversation_participant"("conv_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."notifications_realtime_send_trigger"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  PERFORM realtime.send(
    jsonb_build_object(
      'id', NEW.id,
      'type', NEW.type,
      'actor_id', NEW.actor_id,
      'post_id', NEW.post_id,
      'comment_id', NEW.comment_id,
      'read', NEW.read,
      'created_at', NEW.created_at
    ),
    'notification_created',
    'user:' || NEW.user_id::text || ':notifications',
    false
  );

  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."notifications_realtime_send_trigger"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_comment_like_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE comments SET like_count = like_count + 1 WHERE id = NEW.comment_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE comments SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.comment_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_comment_like_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_post_comment_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET comment_count = comment_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET comment_count = GREATEST(comment_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_post_comment_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_post_like_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET like_count = like_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET like_count = GREATEST(like_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_post_like_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_reply_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.parent_id IS NOT NULL THEN
    UPDATE comments SET reply_count = reply_count + 1 WHERE id = NEW.parent_id;
  ELSIF TG_OP = 'DELETE' AND OLD.parent_id IS NOT NULL THEN
    UPDATE comments SET reply_count = GREATEST(reply_count - 1, 0) WHERE id = OLD.parent_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_reply_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_repost_count"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    SET "search_path" TO 'public'
    AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE posts SET repost_count = repost_count + 1 WHERE id = NEW.post_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE posts SET repost_count = GREATEST(repost_count - 1, 0) WHERE id = OLD.post_id;
  END IF;
  RETURN NULL;
END;
$$;


ALTER FUNCTION "public"."update_repost_count"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    SET "search_path" TO 'public'
    AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_updated_at_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."blocks" (
    "blocker_id" "uuid" NOT NULL,
    "blocked_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."blocks" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."close_friends" (
    "user_id" "uuid" NOT NULL,
    "friend_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."close_friends" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."comment_likes" (
    "comment_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."comment_likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."comments" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "parent_id" "uuid",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "like_count" integer DEFAULT 0 NOT NULL,
    "is_deleted" boolean DEFAULT false NOT NULL,
    "edited_at" timestamp with time zone,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "reply_count" integer DEFAULT 0 NOT NULL,
    "is_ai" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."comments" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversation_participants" (
    "conversation_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "role" "text" DEFAULT 'member'::"text" NOT NULL,
    "last_read_at" timestamp with time zone,
    "folder" "text" DEFAULT 'primary'::"text" NOT NULL,
    "is_muted" boolean DEFAULT false NOT NULL,
    "last_message_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "conversation_participants_folder_check" CHECK (("folder" = ANY (ARRAY['primary'::"text", 'general'::"text", 'requests'::"text"]))),
    CONSTRAINT "conversation_participants_role_check" CHECK (("role" = ANY (ARRAY['admin'::"text", 'member'::"text"])))
);


ALTER TABLE "public"."conversation_participants" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."conversations" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "title" "text",
    "avatar_url" "text",
    "last_message_preview" "text",
    "last_message_at" timestamp with time zone,
    "last_message_sender_id" "uuid"
);


ALTER TABLE "public"."conversations" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."follow_requests" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "requester_id" "uuid" NOT NULL,
    "target_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."follow_requests" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."follows" (
    "follower_id" "uuid" NOT NULL,
    "following_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "status" "text" DEFAULT 'accepted'::"text" NOT NULL,
    CONSTRAINT "follows_check" CHECK (("follower_id" <> "following_id")),
    CONSTRAINT "follows_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'accepted'::"text"])))
);


ALTER TABLE "public"."follows" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."hashtags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL
);


ALTER TABLE "public"."hashtags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."likes" (
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."likes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "conversation_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "content" "text",
    "media_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "read_at" timestamp with time zone,
    "reply_to_id" "uuid",
    "edited_at" timestamp with time zone,
    "is_deleted" boolean DEFAULT false NOT NULL,
    "sticker_url" "text",
    "story_id" "uuid",
    "post_id" "uuid",
    "audio_url" "text",
    "call_event" "text"
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."mutes" (
    "user_id" "uuid" NOT NULL,
    "muted_user_id" "uuid" NOT NULL,
    "mute_posts" boolean DEFAULT true NOT NULL,
    "mute_stories" boolean DEFAULT true NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."mutes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    CONSTRAINT "notes_content_check" CHECK ((("char_length"("content") >= 1) AND ("char_length"("content") <= 60)))
);


ALTER TABLE "public"."notes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "actor_id" "uuid" NOT NULL,
    "post_id" "uuid",
    "comment_id" "uuid",
    "read" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "story_id" "uuid",
    "message_id" "uuid",
    CONSTRAINT "notifications_type_check" CHECK (("type" = ANY (ARRAY['like'::"text", 'comment'::"text", 'follow'::"text", 'mention'::"text", 'message'::"text", 'story_reply'::"text", 'story_mention'::"text", 'collaborator_invite'::"text", 'story_like'::"text", 'tag'::"text"])))
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_collaborators" (
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL
);


ALTER TABLE "public"."post_collaborators" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_hashtags" (
    "post_id" "uuid" NOT NULL,
    "hashtag_id" "uuid" NOT NULL
);


ALTER TABLE "public"."post_hashtags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_image_tags" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "image_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "x" numeric NOT NULL,
    "y" numeric NOT NULL
);


ALTER TABLE "public"."post_image_tags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "width" integer,
    "height" integer,
    "blur_data_url" "text",
    "alt_text" "text",
    "unsplash_attribution" "jsonb"
);


ALTER TABLE "public"."post_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_shares" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "recipient_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."post_shares" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."post_videos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "post_id" "uuid" NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "mux_asset_id" "text",
    "mux_status" "text" DEFAULT 'waiting'::"text" NOT NULL,
    "duration" numeric,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "mux_playback_id" "text",
    "width" integer,
    "height" integer
);


ALTER TABLE "public"."post_videos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."posts" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "caption" "text",
    "type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "aspect_ratio" "text" DEFAULT 'original'::"text" NOT NULL,
    "location_name" "text",
    "location_lat" numeric,
    "location_lon" numeric,
    "hide_likes" boolean DEFAULT false NOT NULL,
    "comments_off" boolean DEFAULT false NOT NULL,
    "share_to_clonedbook" boolean DEFAULT false NOT NULL,
    "is_archived" boolean DEFAULT false NOT NULL,
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "like_count" integer DEFAULT 0 NOT NULL,
    "comment_count" integer DEFAULT 0 NOT NULL,
    "repost_count" integer DEFAULT 0 NOT NULL,
    "is_ai" boolean DEFAULT false NOT NULL,
    CONSTRAINT "posts_type_check" CHECK (("type" = ANY (ARRAY['photo'::"text", 'reel'::"text"])))
);


ALTER TABLE "public"."posts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "username" "text" NOT NULL,
    "full_name" "text",
    "avatar_url" "text",
    "bio" "text",
    "website" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_private" boolean DEFAULT false NOT NULL,
    "is_verified" boolean DEFAULT false NOT NULL,
    "gender" "text",
    "is_ai" boolean DEFAULT false NOT NULL,
    "hide_ai_content" boolean DEFAULT false NOT NULL,
    "avatar_attribution" "jsonb"
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reports" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "reporter_id" "uuid" NOT NULL,
    "type" "text" NOT NULL,
    "target_id" "uuid" NOT NULL,
    "reason" "text" NOT NULL,
    "status" "text" DEFAULT 'pending'::"text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "reports_status_check" CHECK (("status" = ANY (ARRAY['pending'::"text", 'resolved'::"text", 'dismissed'::"text"]))),
    CONSTRAINT "reports_type_check" CHECK (("type" = ANY (ARRAY['post'::"text", 'story'::"text", 'comment'::"text", 'profile'::"text", 'message'::"text"])))
);


ALTER TABLE "public"."reports" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."reposts" (
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."reposts" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."saved_collection_items" (
    "collection_id" "uuid" NOT NULL,
    "post_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."saved_collection_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."saved_collections" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "name" "text" NOT NULL,
    "cover_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."saved_collections" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."saves" (
    "post_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."saves" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."search_history" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "query" "text" NOT NULL,
    "type" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "search_history_type_check" CHECK (("type" = ANY (ARRAY['user'::"text", 'hashtag'::"text", 'place'::"text"])))
);


ALTER TABLE "public"."search_history" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."stories" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "expires_at" timestamp with time zone DEFAULT ("now"() + '1 mon'::interval) NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "is_ai" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."stories" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."story_highlight_items" (
    "highlight_id" "uuid" NOT NULL,
    "story_id" "uuid" NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."story_highlight_items" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."story_highlights" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "title" "text" NOT NULL,
    "cover_url" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "is_ai" boolean DEFAULT false NOT NULL
);


ALTER TABLE "public"."story_highlights" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."story_images" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "story_id" "uuid" NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "url" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "blur_data_url" "text",
    "unsplash_attribution" "jsonb"
);


ALTER TABLE "public"."story_images" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."story_mentions" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "story_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "x" numeric NOT NULL,
    "y" numeric NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."story_mentions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."story_reactions" (
    "story_id" "uuid" NOT NULL,
    "user_id" "uuid" NOT NULL,
    "emoji" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."story_reactions" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."story_videos" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "story_id" "uuid" NOT NULL,
    "position" integer DEFAULT 0 NOT NULL,
    "mux_asset_id" "text",
    "mux_playback_id" "text",
    "mux_status" "text" DEFAULT 'waiting'::"text" NOT NULL,
    "duration" numeric,
    "created_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."story_videos" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."story_views" (
    "story_id" "uuid" NOT NULL,
    "viewer_id" "uuid" NOT NULL,
    "viewed_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."story_views" OWNER TO "postgres";


ALTER TABLE ONLY "public"."blocks"
    ADD CONSTRAINT "blocks_pkey" PRIMARY KEY ("blocker_id", "blocked_id");



ALTER TABLE ONLY "public"."close_friends"
    ADD CONSTRAINT "close_friends_pkey" PRIMARY KEY ("user_id", "friend_id");



ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_pkey" PRIMARY KEY ("comment_id", "user_id");



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."conversation_participants"
    ADD CONSTRAINT "conversation_participants_pkey" PRIMARY KEY ("conversation_id", "user_id");



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."follow_requests"
    ADD CONSTRAINT "follow_requests_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."follow_requests"
    ADD CONSTRAINT "follow_requests_requester_id_target_id_key" UNIQUE ("requester_id", "target_id");



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_pkey" PRIMARY KEY ("follower_id", "following_id");



ALTER TABLE ONLY "public"."hashtags"
    ADD CONSTRAINT "hashtags_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."hashtags"
    ADD CONSTRAINT "hashtags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_pkey" PRIMARY KEY ("post_id", "user_id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."mutes"
    ADD CONSTRAINT "mutes_pkey" PRIMARY KEY ("user_id", "muted_user_id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_user_id_key" UNIQUE ("user_id");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_collaborators"
    ADD CONSTRAINT "post_collaborators_pkey" PRIMARY KEY ("post_id", "user_id");



ALTER TABLE ONLY "public"."post_hashtags"
    ADD CONSTRAINT "post_hashtags_pkey" PRIMARY KEY ("post_id", "hashtag_id");



ALTER TABLE ONLY "public"."post_image_tags"
    ADD CONSTRAINT "post_image_tags_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_images"
    ADD CONSTRAINT "post_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_shares"
    ADD CONSTRAINT "post_shares_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."post_videos"
    ADD CONSTRAINT "post_videos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."reposts"
    ADD CONSTRAINT "reposts_pkey" PRIMARY KEY ("post_id", "user_id");



ALTER TABLE ONLY "public"."saved_collection_items"
    ADD CONSTRAINT "saved_collection_items_pkey" PRIMARY KEY ("collection_id", "post_id");



ALTER TABLE ONLY "public"."saved_collections"
    ADD CONSTRAINT "saved_collections_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."saves"
    ADD CONSTRAINT "saves_pkey" PRIMARY KEY ("post_id", "user_id");



ALTER TABLE ONLY "public"."search_history"
    ADD CONSTRAINT "search_history_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."stories"
    ADD CONSTRAINT "stories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."story_highlight_items"
    ADD CONSTRAINT "story_highlight_items_pkey" PRIMARY KEY ("highlight_id", "story_id");



ALTER TABLE ONLY "public"."story_highlights"
    ADD CONSTRAINT "story_highlights_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."story_images"
    ADD CONSTRAINT "story_images_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."story_mentions"
    ADD CONSTRAINT "story_mentions_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."story_reactions"
    ADD CONSTRAINT "story_reactions_pkey" PRIMARY KEY ("story_id", "user_id");



ALTER TABLE ONLY "public"."story_videos"
    ADD CONSTRAINT "story_videos_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."story_views"
    ADD CONSTRAINT "story_views_pkey" PRIMARY KEY ("story_id", "viewer_id");



CREATE INDEX "blocks_blocked_id_idx" ON "public"."blocks" USING "btree" ("blocked_id");



CREATE INDEX "close_friends_friend_id_idx" ON "public"."close_friends" USING "btree" ("friend_id");



CREATE INDEX "comment_likes_user_id_idx" ON "public"."comment_likes" USING "btree" ("user_id");



CREATE INDEX "comments_parent_id_created_at_idx" ON "public"."comments" USING "btree" ("parent_id", "created_at");



CREATE INDEX "comments_post_id_created_at_idx" ON "public"."comments" USING "btree" ("post_id", "created_at");



CREATE INDEX "comments_user_id_created_at_idx" ON "public"."comments" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "conversation_participants_folder_idx" ON "public"."conversation_participants" USING "btree" ("user_id", "folder");



CREATE INDEX "conversation_participants_last_message_idx" ON "public"."conversation_participants" USING "btree" ("user_id", "last_message_at" DESC);



CREATE INDEX "follow_requests_requester_id_idx" ON "public"."follow_requests" USING "btree" ("requester_id");



CREATE INDEX "follow_requests_target_id_idx" ON "public"."follow_requests" USING "btree" ("target_id");



CREATE INDEX "follows_follower_id_idx" ON "public"."follows" USING "btree" ("follower_id");



CREATE INDEX "follows_following_id_idx" ON "public"."follows" USING "btree" ("following_id");



CREATE INDEX "idx_comments_is_ai" ON "public"."comments" USING "btree" ("is_ai") WHERE ("is_ai" = true);



CREATE INDEX "idx_posts_is_ai" ON "public"."posts" USING "btree" ("is_ai") WHERE ("is_ai" = true);



CREATE INDEX "idx_profiles_is_ai" ON "public"."profiles" USING "btree" ("is_ai") WHERE ("is_ai" = true);



CREATE INDEX "likes_post_id_idx" ON "public"."likes" USING "btree" ("post_id");



CREATE INDEX "likes_user_id_created_at_idx" ON "public"."likes" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "messages_conversation_id_created_at_idx" ON "public"."messages" USING "btree" ("conversation_id", "created_at");



CREATE INDEX "messages_story_id_idx" ON "public"."messages" USING "btree" ("story_id");



CREATE INDEX "mutes_muted_user_id_idx" ON "public"."mutes" USING "btree" ("muted_user_id");



CREATE INDEX "notifications_read_created_at_idx" ON "public"."notifications" USING "btree" ("read", "created_at" DESC);



CREATE INDEX "notifications_user_id_created_at_idx" ON "public"."notifications" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "post_collaborators_user_id_idx" ON "public"."post_collaborators" USING "btree" ("user_id");



CREATE INDEX "post_hashtags_hashtag_id_idx" ON "public"."post_hashtags" USING "btree" ("hashtag_id");



CREATE INDEX "post_image_tags_image_id_idx" ON "public"."post_image_tags" USING "btree" ("image_id");



CREATE INDEX "post_image_tags_user_id_idx" ON "public"."post_image_tags" USING "btree" ("user_id");



CREATE INDEX "post_images_post_id_idx" ON "public"."post_images" USING "btree" ("post_id");



CREATE INDEX "post_shares_post_id_idx" ON "public"."post_shares" USING "btree" ("post_id");



CREATE INDEX "post_shares_recipient_id_idx" ON "public"."post_shares" USING "btree" ("recipient_id");



CREATE INDEX "post_shares_sender_id_idx" ON "public"."post_shares" USING "btree" ("sender_id");



CREATE INDEX "post_videos_post_id_idx" ON "public"."post_videos" USING "btree" ("post_id");



CREATE INDEX "posts_created_at_idx" ON "public"."posts" USING "btree" ("created_at" DESC);



CREATE INDEX "posts_type_created_at_idx" ON "public"."posts" USING "btree" ("type", "created_at" DESC);



CREATE INDEX "posts_user_id_created_at_idx" ON "public"."posts" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "profiles_created_at_idx" ON "public"."profiles" USING "btree" ("created_at" DESC);



CREATE INDEX "reports_reporter_id_idx" ON "public"."reports" USING "btree" ("reporter_id");



CREATE INDEX "reports_status_idx" ON "public"."reports" USING "btree" ("status");



CREATE INDEX "saved_collection_items_post_id_idx" ON "public"."saved_collection_items" USING "btree" ("post_id");



CREATE INDEX "saved_collections_user_id_idx" ON "public"."saved_collections" USING "btree" ("user_id");



CREATE INDEX "saves_user_id_created_at_idx" ON "public"."saves" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "search_history_user_id_created_at_idx" ON "public"."search_history" USING "btree" ("user_id", "created_at" DESC);



CREATE INDEX "stories_user_id_expires_at_idx" ON "public"."stories" USING "btree" ("user_id", "expires_at");



CREATE INDEX "story_highlight_items_story_id_idx" ON "public"."story_highlight_items" USING "btree" ("story_id");



CREATE INDEX "story_highlights_user_id_idx" ON "public"."story_highlights" USING "btree" ("user_id");



CREATE INDEX "story_images_story_id_idx" ON "public"."story_images" USING "btree" ("story_id");



CREATE INDEX "story_mentions_story_id_idx" ON "public"."story_mentions" USING "btree" ("story_id");



CREATE INDEX "story_mentions_user_id_idx" ON "public"."story_mentions" USING "btree" ("user_id");



CREATE INDEX "story_reactions_story_id_idx" ON "public"."story_reactions" USING "btree" ("story_id");



CREATE INDEX "story_videos_story_id_idx" ON "public"."story_videos" USING "btree" ("story_id");



CREATE INDEX "story_views_story_id_idx" ON "public"."story_views" USING "btree" ("story_id");



CREATE OR REPLACE TRIGGER "after_participant_removed" AFTER DELETE ON "public"."conversation_participants" FOR EACH ROW EXECUTE FUNCTION "public"."delete_underpopulated_conversations"();



CREATE OR REPLACE TRIGGER "comments_updated_at" BEFORE UPDATE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "conversations_updated_at" BEFORE UPDATE ON "public"."conversations" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "message_insert_denormalize" AFTER INSERT ON "public"."messages" FOR EACH ROW EXECUTE FUNCTION "public"."handle_message_insert"();



CREATE OR REPLACE TRIGGER "notifications_realtime_send_trigger" AFTER INSERT ON "public"."notifications" FOR EACH ROW EXECUTE FUNCTION "public"."notifications_realtime_send_trigger"();



CREATE OR REPLACE TRIGGER "on_comment_insert" AFTER INSERT ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."handle_comment_notification"();



CREATE OR REPLACE TRIGGER "on_comment_like_delete" AFTER DELETE ON "public"."comment_likes" FOR EACH ROW EXECUTE FUNCTION "public"."handle_comment_unlike_notification"();



CREATE OR REPLACE TRIGGER "on_comment_like_insert" AFTER INSERT ON "public"."comment_likes" FOR EACH ROW EXECUTE FUNCTION "public"."handle_comment_like_notification"();



CREATE OR REPLACE TRIGGER "on_follow_delete" AFTER DELETE ON "public"."follows" FOR EACH ROW EXECUTE FUNCTION "public"."handle_unfollow_notification"();



CREATE OR REPLACE TRIGGER "on_follow_insert" AFTER INSERT ON "public"."follows" FOR EACH ROW EXECUTE FUNCTION "public"."handle_follow_notification"();



CREATE OR REPLACE TRIGGER "on_like_delete" AFTER DELETE ON "public"."likes" FOR EACH ROW EXECUTE FUNCTION "public"."handle_unlike_notification"();



CREATE OR REPLACE TRIGGER "on_like_insert" AFTER INSERT ON "public"."likes" FOR EACH ROW EXECUTE FUNCTION "public"."handle_like_notification"();



CREATE OR REPLACE TRIGGER "on_repost_change" AFTER INSERT OR DELETE ON "public"."reposts" FOR EACH ROW EXECUTE FUNCTION "public"."update_repost_count"();



CREATE OR REPLACE TRIGGER "on_story_reaction_insert" AFTER INSERT ON "public"."story_reactions" FOR EACH ROW EXECUTE FUNCTION "public"."handle_story_reaction_notification"();



CREATE OR REPLACE TRIGGER "posts_updated_at" BEFORE UPDATE ON "public"."posts" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "profiles_updated_at" BEFORE UPDATE ON "public"."profiles" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "reports_updated_at" BEFORE UPDATE ON "public"."reports" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "saved_collections_updated_at" BEFORE UPDATE ON "public"."saved_collections" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "story_highlights_updated_at" BEFORE UPDATE ON "public"."story_highlights" FOR EACH ROW EXECUTE FUNCTION "public"."update_updated_at_column"();



CREATE OR REPLACE TRIGGER "trg_update_comment_like_count" AFTER INSERT OR DELETE ON "public"."comment_likes" FOR EACH ROW EXECUTE FUNCTION "public"."update_comment_like_count"();



CREATE OR REPLACE TRIGGER "trg_update_post_comment_count" AFTER INSERT OR DELETE ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_post_comment_count"();



CREATE OR REPLACE TRIGGER "trg_update_post_like_count" AFTER INSERT OR DELETE ON "public"."likes" FOR EACH ROW EXECUTE FUNCTION "public"."update_post_like_count"();



CREATE OR REPLACE TRIGGER "trg_update_reply_count" AFTER INSERT OR DELETE OR UPDATE OF "is_deleted" ON "public"."comments" FOR EACH ROW EXECUTE FUNCTION "public"."update_reply_count"();



ALTER TABLE ONLY "public"."blocks"
    ADD CONSTRAINT "blocks_blocked_id_fkey" FOREIGN KEY ("blocked_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."blocks"
    ADD CONSTRAINT "blocks_blocker_id_fkey" FOREIGN KEY ("blocker_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."close_friends"
    ADD CONSTRAINT "close_friends_friend_id_fkey" FOREIGN KEY ("friend_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."close_friends"
    ADD CONSTRAINT "close_friends_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comment_likes"
    ADD CONSTRAINT "comment_likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."comments"
    ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_participants"
    ADD CONSTRAINT "conversation_participants_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversation_participants"
    ADD CONSTRAINT "conversation_participants_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."conversations"
    ADD CONSTRAINT "conversations_last_message_sender_id_fkey" FOREIGN KEY ("last_message_sender_id") REFERENCES "public"."profiles"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."follow_requests"
    ADD CONSTRAINT "follow_requests_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."follow_requests"
    ADD CONSTRAINT "follow_requests_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."follows"
    ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."likes"
    ADD CONSTRAINT "likes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_conversation_id_fkey" FOREIGN KEY ("conversation_id") REFERENCES "public"."conversations"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_reply_to_id_fkey" FOREIGN KEY ("reply_to_id") REFERENCES "public"."messages"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."mutes"
    ADD CONSTRAINT "mutes_muted_user_id_fkey" FOREIGN KEY ("muted_user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."mutes"
    ADD CONSTRAINT "mutes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notes"
    ADD CONSTRAINT "notes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_actor_id_fkey" FOREIGN KEY ("actor_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_message_id_fkey" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_collaborators"
    ADD CONSTRAINT "post_collaborators_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_collaborators"
    ADD CONSTRAINT "post_collaborators_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_hashtags"
    ADD CONSTRAINT "post_hashtags_hashtag_id_fkey" FOREIGN KEY ("hashtag_id") REFERENCES "public"."hashtags"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_hashtags"
    ADD CONSTRAINT "post_hashtags_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_image_tags"
    ADD CONSTRAINT "post_image_tags_image_id_fkey" FOREIGN KEY ("image_id") REFERENCES "public"."post_images"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_image_tags"
    ADD CONSTRAINT "post_image_tags_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_images"
    ADD CONSTRAINT "post_images_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_shares"
    ADD CONSTRAINT "post_shares_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_shares"
    ADD CONSTRAINT "post_shares_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_shares"
    ADD CONSTRAINT "post_shares_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."post_videos"
    ADD CONSTRAINT "post_videos_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."posts"
    ADD CONSTRAINT "posts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reports"
    ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reposts"
    ADD CONSTRAINT "reposts_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."reposts"
    ADD CONSTRAINT "reposts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_collection_items"
    ADD CONSTRAINT "saved_collection_items_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "public"."saved_collections"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_collection_items"
    ADD CONSTRAINT "saved_collection_items_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saved_collections"
    ADD CONSTRAINT "saved_collections_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saves"
    ADD CONSTRAINT "saves_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."saves"
    ADD CONSTRAINT "saves_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."search_history"
    ADD CONSTRAINT "search_history_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."stories"
    ADD CONSTRAINT "stories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_highlight_items"
    ADD CONSTRAINT "story_highlight_items_highlight_id_fkey" FOREIGN KEY ("highlight_id") REFERENCES "public"."story_highlights"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_highlight_items"
    ADD CONSTRAINT "story_highlight_items_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_highlights"
    ADD CONSTRAINT "story_highlights_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_images"
    ADD CONSTRAINT "story_images_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_mentions"
    ADD CONSTRAINT "story_mentions_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_mentions"
    ADD CONSTRAINT "story_mentions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_reactions"
    ADD CONSTRAINT "story_reactions_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_reactions"
    ADD CONSTRAINT "story_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_videos"
    ADD CONSTRAINT "story_videos_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_views"
    ADD CONSTRAINT "story_views_story_id_fkey" FOREIGN KEY ("story_id") REFERENCES "public"."stories"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."story_views"
    ADD CONSTRAINT "story_views_viewer_id_fkey" FOREIGN KEY ("viewer_id") REFERENCES "public"."profiles"("id") ON DELETE CASCADE;



CREATE POLICY "Anyone can read reposts" ON "public"."reposts" FOR SELECT USING (true);



CREATE POLICY "Requester can cancel; target can accept or decline" ON "public"."follow_requests" FOR DELETE USING ((("auth"."uid"() = "requester_id") OR ("auth"."uid"() = "target_id")));



CREATE POLICY "Users can manage their own reposts" ON "public"."reposts" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Users can send follow requests as themselves" ON "public"."follow_requests" FOR INSERT WITH CHECK (("auth"."uid"() = "requester_id"));



CREATE POLICY "Users can view their own sent and received follow requests" ON "public"."follow_requests" FOR SELECT USING ((("auth"."uid"() = "requester_id") OR ("auth"."uid"() = "target_id")));



ALTER TABLE "public"."blocks" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "blocks_delete_own" ON "public"."blocks" FOR DELETE USING (("auth"."uid"() = "blocker_id"));



CREATE POLICY "blocks_insert_own" ON "public"."blocks" FOR INSERT WITH CHECK (("auth"."uid"() = "blocker_id"));



CREATE POLICY "blocks_select_own" ON "public"."blocks" FOR SELECT USING (("auth"."uid"() = "blocker_id"));



ALTER TABLE "public"."close_friends" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "close_friends_delete_own" ON "public"."close_friends" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "close_friends_insert_own" ON "public"."close_friends" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "close_friends_select_own" ON "public"."close_friends" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."comment_likes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "comment_likes_delete_own" ON "public"."comment_likes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "comment_likes_insert_own" ON "public"."comment_likes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "comment_likes_select_all" ON "public"."comment_likes" FOR SELECT USING (true);



ALTER TABLE "public"."comments" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "comments_delete_own" ON "public"."comments" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "comments_delete_post_owner" ON "public"."comments" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "comments"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "comments_insert_own" ON "public"."comments" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "comments_select_all" ON "public"."comments" FOR SELECT USING ((NOT "is_deleted"));



ALTER TABLE "public"."conversation_participants" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "conversation_participants_delete_self" ON "public"."conversation_participants" FOR DELETE USING (("user_id" = "auth"."uid"()));



CREATE POLICY "conversation_participants_insert_participant" ON "public"."conversation_participants" FOR INSERT WITH CHECK (("public"."is_conversation_participant"("conversation_id") OR (NOT "public"."conversation_has_participants"("conversation_id"))));



CREATE POLICY "conversation_participants_select_participant" ON "public"."conversation_participants" FOR SELECT USING ("public"."is_conversation_participant"("conversation_id"));



CREATE POLICY "conversation_participants_update_self" ON "public"."conversation_participants" FOR UPDATE USING (("user_id" = "auth"."uid"())) WITH CHECK (("user_id" = "auth"."uid"()));



ALTER TABLE "public"."conversations" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "conversations_insert_auth" ON "public"."conversations" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "conversations_select_participant" ON "public"."conversations" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."conversation_participants"
  WHERE (("conversation_participants"."conversation_id" = "conversations"."id") AND ("conversation_participants"."user_id" = "auth"."uid"())))));



CREATE POLICY "conversations_update_participant" ON "public"."conversations" FOR UPDATE USING ("public"."is_conversation_participant"("id")) WITH CHECK ("public"."is_conversation_participant"("id"));



ALTER TABLE "public"."follow_requests" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."follows" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "follows_delete_own" ON "public"."follows" FOR DELETE USING (("auth"."uid"() = "follower_id"));



CREATE POLICY "follows_insert_own" ON "public"."follows" FOR INSERT WITH CHECK (("auth"."uid"() = "follower_id"));



CREATE POLICY "follows_select_all" ON "public"."follows" FOR SELECT USING (("status" = 'accepted'::"text"));



CREATE POLICY "follows_update_own" ON "public"."follows" FOR UPDATE USING (("auth"."uid"() = "follower_id"));



ALTER TABLE "public"."hashtags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "hashtags_insert_auth" ON "public"."hashtags" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "hashtags_select_all" ON "public"."hashtags" FOR SELECT USING (true);



ALTER TABLE "public"."likes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "likes_delete_own" ON "public"."likes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "likes_insert_own" ON "public"."likes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "likes_select_all" ON "public"."likes" FOR SELECT USING (true);



ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "messages_insert_participant" ON "public"."messages" FOR INSERT WITH CHECK (((EXISTS ( SELECT 1
   FROM "public"."conversation_participants"
  WHERE (("conversation_participants"."conversation_id" = "messages"."conversation_id") AND ("conversation_participants"."user_id" = "auth"."uid"())))) AND ("auth"."uid"() = "sender_id")));



CREATE POLICY "messages_select_participant" ON "public"."messages" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."conversation_participants"
  WHERE (("conversation_participants"."conversation_id" = "messages"."conversation_id") AND ("conversation_participants"."user_id" = "auth"."uid"())))));



CREATE POLICY "messages_update_own" ON "public"."messages" FOR UPDATE USING (("auth"."uid"() = "sender_id"));



ALTER TABLE "public"."mutes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "mutes_delete_own" ON "public"."mutes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "mutes_insert_own" ON "public"."mutes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "mutes_select_own" ON "public"."mutes" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."notes" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "notes_delete" ON "public"."notes" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "notes_insert" ON "public"."notes" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "notes_select" ON "public"."notes" FOR SELECT USING (true);



CREATE POLICY "notes_update" ON "public"."notes" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "notifications_insert_system" ON "public"."notifications" FOR INSERT WITH CHECK (("auth"."uid"() = "actor_id"));



CREATE POLICY "notifications_select_recipient" ON "public"."notifications" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "notifications_update_recipient" ON "public"."notifications" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."post_collaborators" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "post_collaborators_delete_own" ON "public"."post_collaborators" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_collaborators"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "post_collaborators_insert_own" ON "public"."post_collaborators" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_collaborators"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "post_collaborators_select_all" ON "public"."post_collaborators" FOR SELECT USING (true);



ALTER TABLE "public"."post_hashtags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "post_hashtags_delete_own" ON "public"."post_hashtags" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_hashtags"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "post_hashtags_insert_own" ON "public"."post_hashtags" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_hashtags"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "post_hashtags_select_all" ON "public"."post_hashtags" FOR SELECT USING (true);



ALTER TABLE "public"."post_image_tags" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "post_image_tags_delete_own" ON "public"."post_image_tags" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM ("public"."posts" "p"
     JOIN "public"."post_images" "pi" ON (("p"."id" = "pi"."post_id")))
  WHERE (("pi"."id" = "post_image_tags"."image_id") AND ("p"."user_id" = "auth"."uid"())))));



CREATE POLICY "post_image_tags_insert_own" ON "public"."post_image_tags" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM ("public"."posts" "p"
     JOIN "public"."post_images" "pi" ON (("p"."id" = "pi"."post_id")))
  WHERE (("pi"."id" = "post_image_tags"."image_id") AND ("p"."user_id" = "auth"."uid"())))));



CREATE POLICY "post_image_tags_select_all" ON "public"."post_image_tags" FOR SELECT USING (true);



ALTER TABLE "public"."post_images" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "post_images_delete_own" ON "public"."post_images" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_images"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "post_images_insert_own" ON "public"."post_images" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_images"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "post_images_select_all" ON "public"."post_images" FOR SELECT USING (true);



CREATE POLICY "post_images_update_own" ON "public"."post_images" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_images"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."post_shares" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "post_shares_insert_own" ON "public"."post_shares" FOR INSERT WITH CHECK (("auth"."uid"() = "sender_id"));



CREATE POLICY "post_shares_select_involved" ON "public"."post_shares" FOR SELECT USING ((("auth"."uid"() = "sender_id") OR ("auth"."uid"() = "recipient_id")));



ALTER TABLE "public"."post_videos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "post_videos_delete_own" ON "public"."post_videos" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_videos"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "post_videos_insert_own" ON "public"."post_videos" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_videos"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



CREATE POLICY "post_videos_select_all" ON "public"."post_videos" FOR SELECT USING (true);



CREATE POLICY "post_videos_update_own" ON "public"."post_videos" FOR UPDATE USING ((EXISTS ( SELECT 1
   FROM "public"."posts"
  WHERE (("posts"."id" = "post_videos"."post_id") AND ("posts"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."posts" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "posts_delete_own" ON "public"."posts" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "posts_insert_own" ON "public"."posts" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "posts_select_all" ON "public"."posts" FOR SELECT USING ((NOT "is_archived"));



CREATE POLICY "posts_update_own" ON "public"."posts" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "profiles_delete_own" ON "public"."profiles" FOR DELETE USING (("auth"."uid"() = "id"));



CREATE POLICY "profiles_insert_own" ON "public"."profiles" FOR INSERT WITH CHECK (("auth"."uid"() = "id"));



CREATE POLICY "profiles_select_all" ON "public"."profiles" FOR SELECT USING (true);



CREATE POLICY "profiles_update_own" ON "public"."profiles" FOR UPDATE USING (("auth"."uid"() = "id"));



ALTER TABLE "public"."reports" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "reports_insert_own" ON "public"."reports" FOR INSERT WITH CHECK (("auth"."uid"() = "reporter_id"));



CREATE POLICY "reports_select_own" ON "public"."reports" FOR SELECT USING (("auth"."uid"() = "reporter_id"));



ALTER TABLE "public"."reposts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."saved_collection_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "saved_collection_items_delete_own" ON "public"."saved_collection_items" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."saved_collections"
  WHERE (("saved_collections"."id" = "saved_collection_items"."collection_id") AND ("saved_collections"."user_id" = "auth"."uid"())))));



CREATE POLICY "saved_collection_items_insert_own" ON "public"."saved_collection_items" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."saved_collections"
  WHERE (("saved_collections"."id" = "saved_collection_items"."collection_id") AND ("saved_collections"."user_id" = "auth"."uid"())))));



CREATE POLICY "saved_collection_items_select_own" ON "public"."saved_collection_items" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."saved_collections"
  WHERE (("saved_collections"."id" = "saved_collection_items"."collection_id") AND ("saved_collections"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."saved_collections" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "saved_collections_delete_own" ON "public"."saved_collections" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "saved_collections_insert_own" ON "public"."saved_collections" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "saved_collections_select_own" ON "public"."saved_collections" FOR SELECT USING (("auth"."uid"() = "user_id"));



CREATE POLICY "saved_collections_update_own" ON "public"."saved_collections" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."saves" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "saves_delete_own" ON "public"."saves" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "saves_insert_own" ON "public"."saves" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "saves_select_own" ON "public"."saves" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."search_history" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "search_history_delete_own" ON "public"."search_history" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "search_history_insert_own" ON "public"."search_history" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "search_history_select_own" ON "public"."search_history" FOR SELECT USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."stories" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "stories_delete" ON "public"."stories" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "stories_delete_own" ON "public"."stories" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "stories_insert" ON "public"."stories" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "stories_insert_own" ON "public"."stories" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "stories_select" ON "public"."stories" FOR SELECT USING ((("auth"."uid"() = "user_id") OR ("auth"."uid"() IN ( SELECT "follows"."follower_id"
   FROM "public"."follows"
  WHERE (("follows"."following_id" = "stories"."user_id") AND ("follows"."status" = 'accepted'::"text"))))));



CREATE POLICY "stories_select_all" ON "public"."stories" FOR SELECT USING (true);



ALTER TABLE "public"."story_highlight_items" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "story_highlight_items_delete_own" ON "public"."story_highlight_items" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."story_highlights"
  WHERE (("story_highlights"."id" = "story_highlight_items"."highlight_id") AND ("story_highlights"."user_id" = "auth"."uid"())))));



CREATE POLICY "story_highlight_items_insert_own" ON "public"."story_highlight_items" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."story_highlights"
  WHERE (("story_highlights"."id" = "story_highlight_items"."highlight_id") AND ("story_highlights"."user_id" = "auth"."uid"())))));



CREATE POLICY "story_highlight_items_select_all" ON "public"."story_highlight_items" FOR SELECT USING (true);



ALTER TABLE "public"."story_highlights" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "story_highlights_delete_own" ON "public"."story_highlights" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "story_highlights_insert_own" ON "public"."story_highlights" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "story_highlights_select_all" ON "public"."story_highlights" FOR SELECT USING (true);



CREATE POLICY "story_highlights_update_own" ON "public"."story_highlights" FOR UPDATE USING (("auth"."uid"() = "user_id"));



ALTER TABLE "public"."story_images" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "story_images_delete" ON "public"."story_images" FOR DELETE USING (("story_id" IN ( SELECT "stories"."id"
   FROM "public"."stories"
  WHERE ("stories"."user_id" = "auth"."uid"()))));



CREATE POLICY "story_images_delete_own" ON "public"."story_images" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."stories"
  WHERE (("stories"."id" = "story_images"."story_id") AND ("stories"."user_id" = "auth"."uid"())))));



CREATE POLICY "story_images_insert" ON "public"."story_images" FOR INSERT WITH CHECK (("story_id" IN ( SELECT "stories"."id"
   FROM "public"."stories"
  WHERE ("stories"."user_id" = "auth"."uid"()))));



CREATE POLICY "story_images_insert_own" ON "public"."story_images" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."stories"
  WHERE (("stories"."id" = "story_images"."story_id") AND ("stories"."user_id" = "auth"."uid"())))));



CREATE POLICY "story_images_select" ON "public"."story_images" FOR SELECT USING (("story_id" IN ( SELECT "stories"."id"
   FROM "public"."stories"
  WHERE (("auth"."uid"() = "stories"."user_id") OR ("auth"."uid"() IN ( SELECT "follows"."follower_id"
           FROM "public"."follows"
          WHERE (("follows"."following_id" = "stories"."user_id") AND ("follows"."status" = 'accepted'::"text"))))))));



CREATE POLICY "story_images_select_all" ON "public"."story_images" FOR SELECT USING (true);



ALTER TABLE "public"."story_mentions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "story_mentions_delete_own" ON "public"."story_mentions" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."stories"
  WHERE (("stories"."id" = "story_mentions"."story_id") AND ("stories"."user_id" = "auth"."uid"())))));



CREATE POLICY "story_mentions_insert_own" ON "public"."story_mentions" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."stories"
  WHERE (("stories"."id" = "story_mentions"."story_id") AND ("stories"."user_id" = "auth"."uid"())))));



CREATE POLICY "story_mentions_select_all" ON "public"."story_mentions" FOR SELECT USING (true);



ALTER TABLE "public"."story_reactions" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "story_reactions_delete" ON "public"."story_reactions" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "story_reactions_delete_own" ON "public"."story_reactions" FOR DELETE USING (("auth"."uid"() = "user_id"));



CREATE POLICY "story_reactions_insert" ON "public"."story_reactions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "story_reactions_insert_own" ON "public"."story_reactions" FOR INSERT WITH CHECK (("auth"."uid"() = "user_id"));



CREATE POLICY "story_reactions_select" ON "public"."story_reactions" FOR SELECT USING ((("auth"."uid"() = "user_id") OR ("story_id" IN ( SELECT "stories"."id"
   FROM "public"."stories"
  WHERE ("stories"."user_id" = "auth"."uid"())))));



CREATE POLICY "story_reactions_select_owner" ON "public"."story_reactions" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."stories"
  WHERE (("stories"."id" = "story_reactions"."story_id") AND ("stories"."user_id" = "auth"."uid"())))));



ALTER TABLE "public"."story_videos" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "story_videos_delete" ON "public"."story_videos" FOR DELETE USING (("story_id" IN ( SELECT "stories"."id"
   FROM "public"."stories"
  WHERE ("stories"."user_id" = "auth"."uid"()))));



CREATE POLICY "story_videos_delete_own" ON "public"."story_videos" FOR DELETE USING ((EXISTS ( SELECT 1
   FROM "public"."stories"
  WHERE (("stories"."id" = "story_videos"."story_id") AND ("stories"."user_id" = "auth"."uid"())))));



CREATE POLICY "story_videos_insert" ON "public"."story_videos" FOR INSERT WITH CHECK (("story_id" IN ( SELECT "stories"."id"
   FROM "public"."stories"
  WHERE ("stories"."user_id" = "auth"."uid"()))));



CREATE POLICY "story_videos_insert_own" ON "public"."story_videos" FOR INSERT WITH CHECK ((EXISTS ( SELECT 1
   FROM "public"."stories"
  WHERE (("stories"."id" = "story_videos"."story_id") AND ("stories"."user_id" = "auth"."uid"())))));



CREATE POLICY "story_videos_select" ON "public"."story_videos" FOR SELECT USING (("story_id" IN ( SELECT "stories"."id"
   FROM "public"."stories"
  WHERE (("auth"."uid"() = "stories"."user_id") OR ("auth"."uid"() IN ( SELECT "follows"."follower_id"
           FROM "public"."follows"
          WHERE (("follows"."following_id" = "stories"."user_id") AND ("follows"."status" = 'accepted'::"text"))))))));



CREATE POLICY "story_videos_select_all" ON "public"."story_videos" FOR SELECT USING (true);



ALTER TABLE "public"."story_views" ENABLE ROW LEVEL SECURITY;


CREATE POLICY "story_views_insert" ON "public"."story_views" FOR INSERT WITH CHECK (("auth"."uid"() = "viewer_id"));



CREATE POLICY "story_views_insert_any" ON "public"."story_views" FOR INSERT WITH CHECK (("auth"."uid"() IS NOT NULL));



CREATE POLICY "story_views_select" ON "public"."story_views" FOR SELECT USING ((("auth"."uid"() = "viewer_id") OR ("story_id" IN ( SELECT "stories"."id"
   FROM "public"."stories"
  WHERE ("stories"."user_id" = "auth"."uid"())))));



CREATE POLICY "story_views_select_owner" ON "public"."story_views" FOR SELECT USING ((EXISTS ( SELECT 1
   FROM "public"."stories"
  WHERE (("stories"."id" = "story_views"."story_id") AND ("stories"."user_id" = "auth"."uid"())))));



GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";



GRANT ALL ON FUNCTION "public"."conversation_has_participants"("conv_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."conversation_has_participants"("conv_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."conversation_has_participants"("conv_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."delete_underpopulated_conversations"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."delete_underpopulated_conversations"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."delete_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."delete_user"() TO "service_role";
GRANT ALL ON FUNCTION "public"."delete_user"() TO "authenticated";



GRANT ALL ON FUNCTION "public"."find_direct_conversation"("p_user_a" "uuid", "p_user_b" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."find_direct_conversation"("p_user_a" "uuid", "p_user_b" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."find_direct_conversation"("p_user_a" "uuid", "p_user_b" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."get_following_posts"("follower_id" "uuid", "before_cursor" timestamp with time zone, "page_size" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_following_posts"("follower_id" "uuid", "before_cursor" timestamp with time zone, "page_size" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_following_posts"("follower_id" "uuid", "before_cursor" timestamp with time zone, "page_size" integer) TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_comment_like_notification"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_comment_like_notification"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_comment_notification"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_comment_notification"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_comment_unlike_notification"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_comment_unlike_notification"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_follow_notification"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_follow_notification"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_like_notification"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_like_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_message_insert"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_message_insert"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_message_insert"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_new_user"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_story_reaction_notification"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_story_reaction_notification"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_unfollow_notification"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_unfollow_notification"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."handle_unlike_notification"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."handle_unlike_notification"() TO "service_role";



GRANT ALL ON FUNCTION "public"."is_conversation_participant"("conv_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."is_conversation_participant"("conv_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."is_conversation_participant"("conv_id" "uuid") TO "service_role";



REVOKE ALL ON FUNCTION "public"."notifications_realtime_send_trigger"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."notifications_realtime_send_trigger"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_comment_like_count"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_comment_like_count"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_post_comment_count"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_post_comment_count"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_post_like_count"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_post_like_count"() TO "service_role";



REVOKE ALL ON FUNCTION "public"."update_reply_count"() FROM PUBLIC;
GRANT ALL ON FUNCTION "public"."update_reply_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_repost_count"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_repost_count"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_repost_count"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_updated_at_column"() TO "service_role";



GRANT ALL ON TABLE "public"."blocks" TO "anon";
GRANT ALL ON TABLE "public"."blocks" TO "authenticated";
GRANT ALL ON TABLE "public"."blocks" TO "service_role";



GRANT ALL ON TABLE "public"."close_friends" TO "anon";
GRANT ALL ON TABLE "public"."close_friends" TO "authenticated";
GRANT ALL ON TABLE "public"."close_friends" TO "service_role";



GRANT ALL ON TABLE "public"."comment_likes" TO "anon";
GRANT ALL ON TABLE "public"."comment_likes" TO "authenticated";
GRANT ALL ON TABLE "public"."comment_likes" TO "service_role";



GRANT ALL ON TABLE "public"."comments" TO "anon";
GRANT ALL ON TABLE "public"."comments" TO "authenticated";
GRANT ALL ON TABLE "public"."comments" TO "service_role";



GRANT ALL ON TABLE "public"."conversation_participants" TO "anon";
GRANT ALL ON TABLE "public"."conversation_participants" TO "authenticated";
GRANT ALL ON TABLE "public"."conversation_participants" TO "service_role";



GRANT ALL ON TABLE "public"."conversations" TO "anon";
GRANT ALL ON TABLE "public"."conversations" TO "authenticated";
GRANT ALL ON TABLE "public"."conversations" TO "service_role";



GRANT ALL ON TABLE "public"."follow_requests" TO "anon";
GRANT ALL ON TABLE "public"."follow_requests" TO "authenticated";
GRANT ALL ON TABLE "public"."follow_requests" TO "service_role";



GRANT ALL ON TABLE "public"."follows" TO "anon";
GRANT ALL ON TABLE "public"."follows" TO "authenticated";
GRANT ALL ON TABLE "public"."follows" TO "service_role";



GRANT ALL ON TABLE "public"."hashtags" TO "anon";
GRANT ALL ON TABLE "public"."hashtags" TO "authenticated";
GRANT ALL ON TABLE "public"."hashtags" TO "service_role";



GRANT ALL ON TABLE "public"."likes" TO "anon";
GRANT ALL ON TABLE "public"."likes" TO "authenticated";
GRANT ALL ON TABLE "public"."likes" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON TABLE "public"."mutes" TO "anon";
GRANT ALL ON TABLE "public"."mutes" TO "authenticated";
GRANT ALL ON TABLE "public"."mutes" TO "service_role";



GRANT ALL ON TABLE "public"."notes" TO "anon";
GRANT ALL ON TABLE "public"."notes" TO "authenticated";
GRANT ALL ON TABLE "public"."notes" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."post_collaborators" TO "anon";
GRANT ALL ON TABLE "public"."post_collaborators" TO "authenticated";
GRANT ALL ON TABLE "public"."post_collaborators" TO "service_role";



GRANT ALL ON TABLE "public"."post_hashtags" TO "anon";
GRANT ALL ON TABLE "public"."post_hashtags" TO "authenticated";
GRANT ALL ON TABLE "public"."post_hashtags" TO "service_role";



GRANT ALL ON TABLE "public"."post_image_tags" TO "anon";
GRANT ALL ON TABLE "public"."post_image_tags" TO "authenticated";
GRANT ALL ON TABLE "public"."post_image_tags" TO "service_role";



GRANT ALL ON TABLE "public"."post_images" TO "anon";
GRANT ALL ON TABLE "public"."post_images" TO "authenticated";
GRANT ALL ON TABLE "public"."post_images" TO "service_role";



GRANT ALL ON TABLE "public"."post_shares" TO "anon";
GRANT ALL ON TABLE "public"."post_shares" TO "authenticated";
GRANT ALL ON TABLE "public"."post_shares" TO "service_role";



GRANT ALL ON TABLE "public"."post_videos" TO "anon";
GRANT ALL ON TABLE "public"."post_videos" TO "authenticated";
GRANT ALL ON TABLE "public"."post_videos" TO "service_role";



GRANT ALL ON TABLE "public"."posts" TO "anon";
GRANT ALL ON TABLE "public"."posts" TO "authenticated";
GRANT ALL ON TABLE "public"."posts" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."reports" TO "anon";
GRANT ALL ON TABLE "public"."reports" TO "authenticated";
GRANT ALL ON TABLE "public"."reports" TO "service_role";



GRANT ALL ON TABLE "public"."reposts" TO "anon";
GRANT ALL ON TABLE "public"."reposts" TO "authenticated";
GRANT ALL ON TABLE "public"."reposts" TO "service_role";



GRANT ALL ON TABLE "public"."saved_collection_items" TO "anon";
GRANT ALL ON TABLE "public"."saved_collection_items" TO "authenticated";
GRANT ALL ON TABLE "public"."saved_collection_items" TO "service_role";



GRANT ALL ON TABLE "public"."saved_collections" TO "anon";
GRANT ALL ON TABLE "public"."saved_collections" TO "authenticated";
GRANT ALL ON TABLE "public"."saved_collections" TO "service_role";



GRANT ALL ON TABLE "public"."saves" TO "anon";
GRANT ALL ON TABLE "public"."saves" TO "authenticated";
GRANT ALL ON TABLE "public"."saves" TO "service_role";



GRANT ALL ON TABLE "public"."search_history" TO "anon";
GRANT ALL ON TABLE "public"."search_history" TO "authenticated";
GRANT ALL ON TABLE "public"."search_history" TO "service_role";



GRANT ALL ON TABLE "public"."stories" TO "anon";
GRANT ALL ON TABLE "public"."stories" TO "authenticated";
GRANT ALL ON TABLE "public"."stories" TO "service_role";



GRANT ALL ON TABLE "public"."story_highlight_items" TO "anon";
GRANT ALL ON TABLE "public"."story_highlight_items" TO "authenticated";
GRANT ALL ON TABLE "public"."story_highlight_items" TO "service_role";



GRANT ALL ON TABLE "public"."story_highlights" TO "anon";
GRANT ALL ON TABLE "public"."story_highlights" TO "authenticated";
GRANT ALL ON TABLE "public"."story_highlights" TO "service_role";



GRANT ALL ON TABLE "public"."story_images" TO "anon";
GRANT ALL ON TABLE "public"."story_images" TO "authenticated";
GRANT ALL ON TABLE "public"."story_images" TO "service_role";



GRANT ALL ON TABLE "public"."story_mentions" TO "anon";
GRANT ALL ON TABLE "public"."story_mentions" TO "authenticated";
GRANT ALL ON TABLE "public"."story_mentions" TO "service_role";



GRANT ALL ON TABLE "public"."story_reactions" TO "anon";
GRANT ALL ON TABLE "public"."story_reactions" TO "authenticated";
GRANT ALL ON TABLE "public"."story_reactions" TO "service_role";



GRANT ALL ON TABLE "public"."story_videos" TO "anon";
GRANT ALL ON TABLE "public"."story_videos" TO "authenticated";
GRANT ALL ON TABLE "public"."story_videos" TO "service_role";



GRANT ALL ON TABLE "public"."story_views" TO "anon";
GRANT ALL ON TABLE "public"."story_views" TO "authenticated";
GRANT ALL ON TABLE "public"."story_views" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";


-- Storage buckets
INSERT INTO "storage"."buckets" ("id", "name", "public") VALUES
  ('avatars', 'avatars', true),
  ('media', 'media', true),
  ('messages', 'messages', true),
  ('mock-images', 'mock-images', true),
  ('posts', 'posts', true),
  ('stories', 'stories', true)
ON CONFLICT ("id") DO UPDATE SET "public" = EXCLUDED."public";


-- Storage policies
DO $$
BEGIN
   ALTER TABLE "storage"."objects" ENABLE ROW LEVEL SECURITY;
EXCEPTION
   WHEN insufficient_privilege THEN NULL;
END $$;

CREATE POLICY "Allow authenticated uploads to media" ON "storage"."objects" FOR INSERT WITH CHECK (("bucket_id" = 'media'::text));

CREATE POLICY "Allow authenticated uploads to posts" ON "storage"."objects" FOR INSERT WITH CHECK (("bucket_id" = 'posts'::text));

CREATE POLICY "Allow owner to list avatars" ON "storage"."objects" FOR SELECT USING ((("bucket_id" = 'avatars'::text) AND ("owner" = "auth"."uid"())));

CREATE POLICY "Allow owner to list media" ON "storage"."objects" FOR SELECT USING ((("bucket_id" = 'media'::text) AND ("owner" = "auth"."uid"())));

CREATE POLICY "Allow owner to list messages" ON "storage"."objects" FOR SELECT USING ((("bucket_id" = 'messages'::text) AND ("owner" = "auth"."uid"())));

CREATE POLICY "Allow owner to list posts" ON "storage"."objects" FOR SELECT USING ((("bucket_id" = 'posts'::text) AND ("owner" = "auth"."uid"())));

CREATE POLICY "Allow owner to list stories" ON "storage"."objects" FOR SELECT USING ((("bucket_id" = 'stories'::text) AND ("owner" = "auth"."uid"())));

CREATE POLICY "Allow users to delete their own media" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'media'::text) AND ("owner" = (SELECT "auth"."uid"() AS "uid"))));

CREATE POLICY "Allow users to delete their own posts" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'posts'::text) AND ("owner" = (SELECT "auth"."uid"() AS "uid"))));

CREATE POLICY "Authenticated users can upload message images" ON "storage"."objects" FOR INSERT WITH CHECK (("bucket_id" = 'messages'::text));

CREATE POLICY "Users can update their own avatar" ON "storage"."objects" FOR UPDATE USING ((("bucket_id" = 'avatars'::text) AND (("storage"."foldername"("name"))[1] = ("auth"."uid"())::text)));

CREATE POLICY "Users can upload their own avatar" ON "storage"."objects" FOR INSERT WITH CHECK ((("bucket_id" = 'avatars'::text) AND (("storage"."foldername"("name"))[1] = ("auth"."uid"())::text)));

CREATE POLICY "stories_objects_delete" ON "storage"."objects" FOR DELETE USING ((("bucket_id" = 'stories'::text) AND ("owner" = "auth"."uid"())));

CREATE POLICY "stories_objects_insert" ON "storage"."objects" FOR INSERT WITH CHECK (("bucket_id" = 'stories'::text));





