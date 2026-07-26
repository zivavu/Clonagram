import 'server-only';

import { getAuthProfile } from './supabase/getAuthProfile';

export async function getHideAiContent() {
   const profile = await getAuthProfile();
   return profile?.hide_ai_content ?? false;
}
