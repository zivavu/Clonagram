import { useQuery } from '@tanstack/react-query';
import { createBrowserClient } from '@/src/lib/supabase/client';

export function useAuthUser() {
   return useQuery({
      queryKey: ['authUser'],
      queryFn: async () => {
         const supabase = createBrowserClient();
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
