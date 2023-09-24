'use client';

import { MantineProvider } from '@mantine/core';
import { theme } from '@/theme';
import { PropsWithChildren } from 'react';
import { Provider } from 'jotai';
import { ModalsProvider } from '@mantine/modals';

export default function Providers({ children }: PropsWithChildren) {
	return (
		<MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
			<ModalsProvider>
				<Provider>{children}</Provider>
			</ModalsProvider>
		</MantineProvider>
	);
}
