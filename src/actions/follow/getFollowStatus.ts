'use server';
import 'server-only';
import {
   getBatchFollowStatuses as queryBatchFollowStatuses,
   getFollowStatus as queryFollowStatus,
} from '@/src/queries/followStatus';
import { getOptionalUser } from '../getAuthUser';

export async function getFollowStatus(targetUserId: string) {
   const { supabase, user } = await getOptionalUser();
   if (!user) return 'none' as const;

   return queryFollowStatus(supabase, user.id, targetUserId);
}

export async function getBatchFollowStatuses(targetIds: string[]) {
   const { supabase, user } = await getOptionalUser();
   if (!user || targetIds.length === 0) return {};

   return queryBatchFollowStatuses(supabase, user.id, targetIds);
}
