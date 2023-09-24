import { UnstyledButton, Group, ThemeIcon, Text } from '@mantine/core';
import { IconGitPullRequest, IconMessages, IconSettings2, IconDashboard } from '@tabler/icons-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';

interface MainLinkProps {
	icon: ReactNode;
	color: string;
	label: string;
	path: string;
	active: boolean;
	onClick: () => void;
}

function MainLink({ icon, color, label, active, path, onClick }: MainLinkProps) {
	return (
		<UnstyledButton
			sx={(theme) => ({
				display: 'block',
				width: '100%',
				padding: theme.spacing.xs,
				borderRadius: theme.radius.sm,
				color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

				'&:hover:not(.active)': {
					backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[1],
				},

				'&.active': {
					cursor: 'initial',
					backgroundColor: theme.fn.themeColor(color, 0),
				},
			})}
			className={active ? 'active' : undefined}
			component={Link}
			href={path}
			onClick={onClick}>
			<Group>
				<ThemeIcon color={color} variant="light">
					{icon}
				</ThemeIcon>

				<Text size="sm">{label}</Text>
			</Group>
		</UnstyledButton>
	);
}

const data = [
	{ icon: <IconDashboard size="1rem" />, color: 'blue', label: 'Dashboard', path: '/' },
	{
		icon: <IconGitPullRequest size="1rem" />,
		color: 'yellow',
		label: 'Questions',
		path: '/questions',
	},
	{ icon: <IconMessages size="1rem" />, color: 'violet', label: 'Submissions', path: '/submissions' },
	// { icon: <IconSettings2 size="1rem" />, color: 'teal', label: 'Settings', path: '/settings' },
];

export function MainLinks({ onClick }: { onClick: () => void }) {
	const pathname = usePathname();
	const links = data.map((link) => (
		<MainLink {...link} onClick={onClick} key={link.label} active={pathname === link.path} />
	));
	return <div>{links}</div>;
}
