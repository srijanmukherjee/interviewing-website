'use client';

import { Header, Container, Group, Burger, Text, Loader, Drawer, Flex } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signout } from '@/service/auth';
import { removeCookie } from 'typescript-cookie';
import { NavbarType, navbarTypeAtom } from '@/state/navbar';
import { useAtom } from 'jotai';
import { authenticatingAtom, userAtom } from '@/state/auth';
import { HEADER_HEIGHT, useStyles } from './style';

interface HeaderResponsiveProps {
	links: { link: string; label: string }[];
}

const loginLink = { link: '/login', label: 'login' };

export default function HeaderResponsive({ links }: HeaderResponsiveProps) {
	const { classes, cx } = useStyles();
	const [opened, { toggle, close }] = useDisclosure(false);
	const pathname = usePathname();
	const [user] = useAtom(userAtom);
	const [authenticating] = useAtom(authenticatingAtom);
	const [navbarType, setNavbarType] = useAtom(navbarTypeAtom);
	const router = useRouter();

	const items = links.map((link) => (
		<Link
			key={link.label}
			href={link.link}
			className={cx(classes.link, { [classes.linkActive]: pathname === link.link })}
			onClick={close}>
			{link.label}
		</Link>
	));

	return (
		<Header height={HEADER_HEIGHT} className={classes.root}>
			<Container className={classes.header} size={navbarType === NavbarType.Normal ? 'lg' : '100%'}>
				<Text fz="lg" weight="bold">
					{process.env.NEXT_PUBLIC_APPLICATION_NAME}
				</Text>
				<Group spacing={5} className={classes.links}>
					{items}
					{authenticating ? (
						<Loader size={16} />
					) : user ? (
						<Link
							href="#"
							onClick={() =>
								signout().finally(() => {
									removeCookie('auth');
									window.location.reload();
								})
							}
							className={classes.link}>
							Logout
						</Link>
					) : (
						<Link
							key={loginLink.label}
							href={loginLink.link}
							className={cx(classes.link, { [classes.linkActive]: pathname === loginLink.link })}>
							{loginLink.label}
						</Link>
					)}
				</Group>

				<Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />

				<Drawer opened={opened} onClose={close} position="right" withCloseButton={false}>
					<Flex h={HEADER_HEIGHT} justify="end">
						<Burger opened={opened} onClick={toggle} className={classes.burger} size="sm" />
					</Flex>
					<Flex direction="column" gap={2} h={`calc(100vh - ${HEADER_HEIGHT})`} style={{ overflow: 'auto' }}>
						{items}
						{authenticating ? (
							<Loader size={16} />
						) : user ? (
							<Link
								href="#"
								onClick={() =>
									signout().finally(() => {
										removeCookie('auth');
										window.location.reload();
									})
								}
								className={classes.link}>
								Logout
							</Link>
						) : (
							<Link
								key={loginLink.label}
								href={loginLink.link}
								className={cx(classes.link, { [classes.linkActive]: pathname === loginLink.link })}
								onClick={close}>
								{loginLink.label}
							</Link>
						)}
					</Flex>
				</Drawer>
			</Container>
		</Header>
	);
}

export { HEADER_HEIGHT };
