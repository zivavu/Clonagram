export const PROFILE_BASE_SELECT =
   'id, username, full_name, avatar_url, bio, website, gender' as const;

export const PROFILE_LIST_SELECT = 'id, username, full_name, avatar_url' as const;

export const PROFILE_LIST_SELECT_BADGES =
   'id, username, full_name, avatar_url, is_private, is_verified' as const;
