import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/src/lib/supabase/client';

export function useAuthUser() {
   return useQuery({
      queryKey: ['authUser'],
      queryFn: async () => {
         const supabaseClient = createBrowserClient();
         const { data: authData, error } = await supabaseClient.auth.getUser();
         if (error) throw error;
         if (!authData?.user?.identities?.length || !authData.user.identities[0].identity_data) {
            throw new Error('No auth user');
         }
         return authData.user.identities[0].identity_data;
      },
      staleTime: Infinity,
   });
}
