'use client';

import { useEffect, useState } from 'react';
import { useDebouncedValue } from '@/src/hooks/useDebouncedValue';
import { supabase } from '@/src/lib/supabase/client';

export type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken';

interface Options {
   /** Value to treat as always-available (the user's own current username). */
   skip?: string;
}

export function useUsernameAvailability(value: string, options?: Options): UsernameStatus {
   const [status, setStatus] = useState<UsernameStatus>('idle');
   const debouncedValue = useDebouncedValue(value, 500);

   useEffect(() => {
      if (!debouncedValue) {
         setStatus('idle');
         return;
      }
      if (options?.skip && debouncedValue === options.skip) {
         setStatus('available');
         return;
      }
      setStatus('checking');
      supabase
         .from('profiles')
         .select('username')
         .eq('username', debouncedValue)
         .maybeSingle()
         .then(({ data }) => {
            setStatus(data ? 'taken' : 'available');
         });
   }, [debouncedValue, options?.skip]);

   return status;
}
