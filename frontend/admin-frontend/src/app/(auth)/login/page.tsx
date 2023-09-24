'use client';

import { Alert, Button, Flex, Paper, PasswordInput, Stack, Text, TextInput, Transition } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useStyles } from './styles';
import { useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { authService } from '@/services';
import { AuthErrorCodes } from 'firebase/auth';
import { FirebaseError } from 'firebase/app';
import { useAtom } from 'jotai';
import { authAtom, loggingInAtom } from '@/state';

export default function Page() {
	const { classes } = useStyles();
	const [, setLoggingIn] = useAtom(loggingInAtom);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string>();
	const [auth] = useAtom(authAtom);
	const form = useForm({
		initialValues: {
			email: '',
			password: '',
		},
		validate: {
			email: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
			password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
		},
	});

	const onSubmit = async ({ email, password }: { email: string; password: string }) => {
		setLoading(true);
		setError(undefined);
		setLoggingIn(true);

		await authService
			.login(email, password)
			.then(async (user) => {
				const { claims } = await user.getIdTokenResult();

				if (claims.admin !== true) {
					setError("You don't have permission");
					await authService.signout();
				}
			})
			.catch((reason) => {
				if (reason instanceof FirebaseError) {
					let message = 'Something went wrong';

					switch (reason.code) {
						case AuthErrorCodes.NETWORK_REQUEST_FAILED:
							message = "Couldn't reach out to the authentication server";
							break;
						case AuthErrorCodes.INVALID_PASSWORD:
						case AuthErrorCodes.USER_DELETED:
							message = 'Invalid email or password';
							break;
					}

					setError(message);
				} else {
					setError('Something terrible happened!');
					console.error(reason);
				}
			})
			.finally(() => {
				setLoading(false);
			});

		setLoggingIn(false);
	};

	return (
		<Flex className={classes.container} align="center" justify="center" p="xl">
			<Paper radius="md" withBorder p="xl" shadow="md" className={classes.paper}>
				<Text size="xl" mb={20}>
					Welcome admin,
				</Text>
				<Transition transition="pop" duration={200} exitDuration={0} mounted={error !== undefined}>
					{(styles) => (
						<Alert
							my="sm"
							radius={'md'}
							color="red"
							title="Bummer!"
							style={{ ...styles }}
							icon={<IconAlertCircle size="1rem" />}>
							{error ?? 'something'}
						</Alert>
					)}
				</Transition>

				<form onSubmit={form.onSubmit(onSubmit)}>
					<Stack>
						<TextInput
							required
							placeholder="youremail@gmail.com"
							label="Email"
							radius="md"
							autoFocus
							disabled={loading}
							value={form.values.email}
							onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
							error={form.errors.email && 'Invalid email'}
						/>
						<PasswordInput
							required
							placeholder="*******"
							label="Password"
							radius="md"
							disabled={loading}
							value={form.values.password}
							onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
							error={form.errors.password && 'Password should include at least 6 characters'}
						/>
					</Stack>

					<Button
						fullWidth
						mt={20}
						radius="md"
						type="submit"
						loading={loading}
						disabled={!auth.loaded || auth.user !== null}>
						{auth.user === null ? 'Login' : 'Logged in'}
					</Button>
				</form>
			</Paper>
		</Flex>
	);
}
