import ProviderLayout from '@/components/ProviderLayout';
import { PropsWithChildren } from 'react';

export const metadata = {
	title: `Login | ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`,
};

export default function AuthLayout({ children }: PropsWithChildren) {
	return <ProviderLayout>{children}</ProviderLayout>;
}
