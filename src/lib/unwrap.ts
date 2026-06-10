import type { PostgrestError } from '@supabase/supabase-js';

export function unwrap<T>(
   result: { data: T | null; error: PostgrestError | null },
   message: string,
): T {
   if (result.error || !result.data) {
      throw new Error(`${message}: ${result.error?.message ?? 'no data returned'}`);
   }
   return result.data;
}
