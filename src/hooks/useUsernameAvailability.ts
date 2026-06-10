'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/src/lib/supabase/client';

export type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken';

interface Options {
   /** Value to treat as always-available (the user's own current username). */
   skip?: string;
}

export function useUsernameAvailability(value: string, options?: Options): UsernameStatus {
   const [status, setStatus] = useState<UsernameStatus>('idle');

   useEffect(() => {
      if (!value) {
         setStatus('idle');
         return;
      }
      if (options?.skip && value === options.skip) {
         setStatus('available');
         return;
      }
      setStatus('checking');
      const timer = setTimeout(async () => {
         const { data } = await supabase
            .from('profiles')
            .select('username')
            .eq('username', value)
            .maybeSingle();
         setStatus(data ? 'taken' : 'available');
      }, 500);
      return () => clearTimeout(timer);
   }, [value, options?.skip]);

   return status;
}
