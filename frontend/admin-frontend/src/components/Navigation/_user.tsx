import { authService } from '@/services';
import {
	useMantineTheme,
	Box,
	rem,
	Group,
	Avatar,
	Text,
	Button,
	Modal,
	TextInput,
	Flex,
	UnstyledButton,
	Tooltip,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useDisclosure } from '@mantine/hooks';
import { updateProfile } from 'firebase/auth';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { IconAlertCircle, IconLogout } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { authAtom } from '@/state';

export default function User() {
	const theme = useMantineTheme();
	const [auth] = useAtom(authAtom);

	const [loading, setLoading] = useState<boolean>(false);
	const [opened, { open, close }] = useDisclosure(false);
	const form = useForm({
		initialValues: {
			displayName: '',
		},

		validate: {
			displayName: (value) => (value.trim().length === 0 ? 'Display name cannot be empty' : null),
		},
	});

	if (!auth.user) return null;

	const user = auth.user;

	const saveDisplayName = async ({ displayName }: { displayName: string }) => {
		setLoading(true);
		try {
			await updateProfile(user, {
				displayName,
			});
			close();
		} catch (error) {
			notifications.show({
				title: 'Error',
				message: 'Failed to update display name',
				color: 'red',
				icon: <IconAlertCircle size="1rem" />,
			});
		}
		setLoading(false);
	};

	return (
		<>
			<Box
				sx={{
					padding: theme.spacing.xs,
					paddingTop: theme.spacing.sm,
					borderTop: `${rem(1)} solid ${
						theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
					}`,
				}}>
				<Flex gap="xs">
					<Avatar src={user.photoURL ?? undefined} radius="xl" />

					<Flex gap="xs" style={{ flex: 1 }}>
						<Box sx={{ flex: 1 }}>
							{user.displayName ? (
								<Text size="sm" weight={500}>
									{user.displayName ?? 'Not available'}
								</Text>
							) : (
								<Button variant="subtle" size="xs" fullWidth onClick={open}>
									Set name
								</Button>
							)}
							<Text color="dimmed" size="xs">
								{user.email}
							</Text>
						</Box>

						<Tooltip label="Logout">
							<UnstyledButton
								sx={(theme) => ({
									alignSelf: 'stretch',
									flexGrow: 0,
									flexShrink: 0,
									borderRadius: theme.radius.sm,
									color: theme.colors.dark[2],
									paddingLeft: '.5rem',
									paddingRight: '.5rem',
									'&:hover': {
										backgroundColor: theme.colors.gray[0],
										color: theme.colors.red[5],
									},
								})}
								onClick={() => {
									authService.signout();
									window.location.href = '/login';
								}}>
								<IconLogout size={'1rem'} />
							</UnstyledButton>
						</Tooltip>
					</Flex>
				</Flex>
			</Box>
			<Modal
				opened={opened}
				onClose={() => {
					close();
					setTimeout(() => form.reset(), 100);
				}}
				centered
				title="Set your display name">
				<form onSubmit={form.onSubmit(saveDisplayName)}>
					<Flex direction="column" gap="xs" align="center" justify="center">
						<Avatar src={user.photoURL ?? undefined} radius="xl" />
						<Text size="sm" weight={500}>
							{form.values.displayName}
						</Text>
						<Text color="dimmed" size="xs">
							{user.email}
						</Text>
					</Flex>
					<TextInput
						label="Display name"
						placeholder="John Doe"
						mt="sm"
						spellCheck={false}
						value={form.values.displayName}
						error={form.errors.displayName}
						onChange={(event) => form.setFieldValue('displayName', event.currentTarget.value)}
					/>
					<Group position="right" mt="sm">
						<Button type="submit" loading={loading}>
							Save
						</Button>
					</Group>
				</form>
			</Modal>
		</>
	);
}
