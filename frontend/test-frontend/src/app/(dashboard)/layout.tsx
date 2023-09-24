import ProviderLayout from '@/components/ProviderLayout';
import { ReactNode } from 'react';

export const metadata = {
	title: process.env.NEXT_PUBLIC_APPLICATION_NAME,
};

interface Props {
	children: ReactNode;
}

export default function Layout({ children }: Props) {
	return <ProviderLayout>{children}</ProviderLayout>;
}
