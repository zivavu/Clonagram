import { ToastProvider } from '@radix-ui/react-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
	title: 'Instagram',
	description: 'Instagram clone',
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	const queryClient = new QueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<ToastProvider>
				<html lang="en">
					<body>{children}</body>
				</html>
			</ToastProvider>
		</QueryClientProvider>
	);
}
