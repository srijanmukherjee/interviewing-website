import './globals.css';
import { Inter } from 'next/font/google';
import Providers from '../components/Providers';
import HeaderResponsive from '@/components/Header';
import { Metadata } from 'next';
import links from './links';
import FirebaseLoader from './FirebaseLoader';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: process.env.NEXT_PUBLIC_APPLCATION_NAME!,
};

const navbarLinks = [
	{ label: 'Home', link: links.home },
	{ label: 'Problems', link: links.problems },
	{ label: 'Terms', link: links.terms },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className={inter.className}>
				<FirebaseLoader />
				<Providers>
					<HeaderResponsive links={navbarLinks} />
				</Providers>
				{children}
			</body>
		</html>
	);
}
