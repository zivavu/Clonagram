import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';
import { throwIfError } from '@/src/lib/unwrap';

export function useAuthUser() {
   return useQuery({
      queryKey: queryKeys.authUser(),
      queryFn: async () => {
         const { data: authData, error } = await supabase.auth.getUser();
         throwIfError({ error }, 'Failed to get auth user');
         if (!authData?.user) throw new Error('No auth user');
         const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
         throwIfError({ error: profileError }, 'Failed to get profile');
         return profile;
      },
      staleTime: Infinity,
   });
}
