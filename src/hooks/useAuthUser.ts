import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/src/lib/supabase/client';

export function useAuthUser() {
   return useQuery({
      queryKey: ['authUser'],
      queryFn: async () => {
         const supabaseClient = createBrowserClient();
         const { data: authData, error } = await supabaseClient.auth.getUser();
         if (error) throw error;
         if (!authData.user) throw new Error('No auth user');
         return authData.user;
      },
      staleTime: Infinity,
   });
}
