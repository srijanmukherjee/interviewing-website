import { PropsWithChildren } from 'react';
import Providers from './Providers';

export default function ProviderLayout({ children }: PropsWithChildren) {
	return <Providers>{children}</Providers>;
}
