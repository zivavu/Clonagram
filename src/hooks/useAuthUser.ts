import { useQuery } from '@tanstack/react-query';
import { queryKeys } from '@/src/lib/queryKeys';
import { supabase } from '@/src/lib/supabase/client';

export function useAuthUser() {
   return useQuery({
      queryKey: queryKeys.authUser(),
      queryFn: async () => {
         const { data: authData, error } = await supabase.auth.getUser();
         if (error) throw error;
         if (!authData?.user) throw new Error('No auth user');
         const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', authData.user.id)
            .single();
         if (profileError) throw profileError;
         return profile;
      },
      staleTime: Infinity,
   });
}
