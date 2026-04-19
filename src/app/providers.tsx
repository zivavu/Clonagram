'use client';

import { ToastProvider } from '@radix-ui/react-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			<ToastProvider>{children}</ToastProvider>
		</QueryClientProvider>
	);
}
