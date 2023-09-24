'use client';

import { MantineProvider, useEmotionCache } from '@mantine/core';
import { useServerInsertedHTML } from 'next/navigation';
import { CacheProvider } from '@emotion/react';
import { theme } from '@/app/theme';
import { ReactNode } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
	const cache = useEmotionCache();
	cache.compat = true;

	useServerInsertedHTML(() => (
		<style
			data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(' ')}`}
			dangerouslySetInnerHTML={{
				__html: Object.values(cache.inserted).join(' '),
			}}
		/>
	));

	return (
		<CacheProvider value={cache}>
			<MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
				{children}
			</MantineProvider>
		</CacheProvider>
	);
}
