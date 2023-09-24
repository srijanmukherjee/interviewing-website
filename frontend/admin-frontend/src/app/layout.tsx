import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import { Inter } from 'next/font/google';
import Initializer from './Initializer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Admin page',
	description: 'admin page for demo app',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<Providers>
					<Initializer>{children}</Initializer>
				</Providers>
			</body>
		</html>
	);
}
