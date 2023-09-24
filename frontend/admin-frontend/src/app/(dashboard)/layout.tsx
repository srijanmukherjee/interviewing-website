'use client';

import Navigation from '@/components/Navigation';
import { AppShell, Burger, Header, ScrollArea, useMantineTheme, Flex, rem } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { PropsWithChildren, useEffect, useRef, useState } from 'react';

// Add language support for prism
// @ts-ignore
import Prism from 'prism-react-renderer/prism';
import { useMediaQuery } from '@mantine/hooks';
import Brand from '@/components/Navigation/_brand';

// @ts-ignore
if (process.browser) {
	// @ts-ignore
	(typeof global !== 'undefined' ? global : window).Prism = Prism;
	require('prismjs/components/prism-kotlin');
	require('prismjs/components/prism-csharp');
	require('prismjs/components/prism-swift');
}

const HEADER_HEIGHT = rem(75);

export default function DashboardLayout({ children }: PropsWithChildren) {
	const theme = useMantineTheme();
	const [opened, setOpened] = useState<boolean>(false);
	const smallDevice = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
	const headerRef = useRef<HTMLElement>(null);

	return (
		<Flex direction={'column'}>
			<Header
				height={{ base: smallDevice ? HEADER_HEIGHT : 0 }}
				ref={headerRef}
				display={smallDevice ? 'block' : 'none'}
				style={{ position: 'fixed' }}>
				<Flex align={'center'} px="xl">
					<Burger
						opened={opened}
						onClick={() => setOpened((o) => !o)}
						size="sm"
						color={theme.colors.gray[6]}
					/>
					<Brand />
				</Flex>
			</Header>
			<AppShell
				navbar={
					<Navigation opened={opened} hiddenBreakpoint="sm" setOpened={setOpened} headerRef={headerRef} />
				}
				padding={0}
				navbarOffsetBreakpoint={'sm'}
				style={{ flex: 1 }}>
				<ScrollArea
					h={smallDevice ? `calc(100vh - ${HEADER_HEIGHT})` : '100vh'}
					offsetScrollbars={false}
					p="xl"
					sx={(theme) => ({
						position: 'relative',
						'.mantine-ScrollArea-viewport': {
							'& > div': {
								display: 'block !important',
							},
						},
					})}>
					{children}
				</ScrollArea>
			</AppShell>
			<Notifications />
		</Flex>
	);
}
