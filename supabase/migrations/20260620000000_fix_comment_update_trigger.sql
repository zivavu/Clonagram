-- Fix enforce_comment_soft_delete blocking all non-soft-delete updates.
--
-- The previous version raised 'Only soft-delete is allowed on comments' on ANY
-- update where is_deleted was unchanged. That broke legitimate updates such as
-- the reply_count bump from update_reply_count (a SECURITY DEFINER trigger that
-- bypasses RLS but still fires this BEFORE UPDATE trigger), making it impossible
-- to insert replies. It also breaks comment like_count maintenance.
--
-- Keep enforcing the is_deleted transition rule (false->true only), but allow
-- updates that don't touch is_deleted to pass through. RLS policies still limit
-- authenticated users to is_deleted = true updates.

CREATE OR REPLACE FUNCTION "public"."enforce_comment_soft_delete"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  IF NEW.is_deleted IS DISTINCT FROM OLD.is_deleted THEN
    IF OLD.is_deleted = true OR NEW.is_deleted = false THEN
      RAISE EXCEPTION 'Comments can only be soft-deleted';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;
