'use client';

import { ToastProvider } from '@radix-ui/react-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
   const [queryClient] = useState(() => new QueryClient());

   return (
      <AppRouterCacheProvider>
         <QueryClientProvider client={queryClient}>
            <ToastProvider>{children}</ToastProvider>
         </QueryClientProvider>
      </AppRouterCacheProvider>
   );
}
