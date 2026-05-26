'use client';

import { ToastProvider } from '@radix-ui/react-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import AppToast from '@/src/components/AppToast';
import { ThemeProvider } from '@/src/components/ThemeProvider';

export function Providers({ children }: { children: React.ReactNode }) {
   const [queryClient] = useState(() => new QueryClient());

   return (
      <QueryClientProvider client={queryClient}>
         <ToastProvider>
            <ThemeProvider>
               {children}
               <AppToast />
            </ThemeProvider>
         </ToastProvider>
      </QueryClientProvider>
   );
}
