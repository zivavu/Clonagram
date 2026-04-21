import type { Metadata } from 'next';
import { DM_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

export const metadata: Metadata = {
	title: 'Instagram',
	description: 'Instagram clone',
};

export default function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {
	return (
		<html lang="en" className={dmSans.variable}>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
