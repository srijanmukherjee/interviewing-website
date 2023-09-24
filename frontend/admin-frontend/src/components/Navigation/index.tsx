import { Box, Drawer, Navbar, ScrollArea, useMantineTheme } from '@mantine/core';
import Brand from './_brand';
import { MainLinks } from './_mainLinks';
import User from './_user';
import { useMediaQuery } from '@mantine/hooks';
import { RefObject } from 'react';

interface Props {
	opened: boolean;
	hiddenBreakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	setOpened: (func: (val: boolean) => boolean) => void;
	headerRef: RefObject<HTMLElement | null>;
}

export default function Navigation({ opened, hiddenBreakpoint, setOpened, headerRef }: Props) {
	const theme = useMantineTheme();
	const smallDevice = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);

	if (smallDevice) {
		return (
			<Drawer
				opened={opened}
				onClose={() => setOpened((o) => !o)}
				transitionProps={{
					transition: 'slide-right',
				}}>
				<Navbar
					height={`calc(100vh - ${headerRef.current?.offsetHeight ?? 0})`}
					p="xs"
					top={headerRef.current?.offsetHeight}>
					<Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
						<Box py="md">
							<MainLinks onClick={() => setOpened((o) => !o)} />
						</Box>
					</Navbar.Section>
					<Navbar.Section>
						<User />
					</Navbar.Section>
				</Navbar>
			</Drawer>
		);
	}

	return (
		<Navbar
			height="100vh"
			width={{ base: smallDevice ? '100vw' : 300 }}
			p="xs"
			hiddenBreakpoint={hiddenBreakpoint}
			hidden={!opened}>
			<Navbar.Section mt="xs">
				<Brand />
			</Navbar.Section>
			<Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
				<Box py="md">
					<MainLinks onClick={() => setOpened((o) => !o)} />
				</Box>
			</Navbar.Section>
			<Navbar.Section>
				<User />
			</Navbar.Section>
		</Navbar>
	);
}
