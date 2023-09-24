'use client';

import { useForm } from '@mantine/form';
import {
	TextInput,
	PasswordInput,
	Text,
	Paper,
	Group,
	Button,
	Stack,
	Container,
	MediaQuery,
	Loader,
	Alert,
} from '@mantine/core';
import { login } from '@/service/auth';
import { AuthErrorCodes } from 'firebase/auth';
import { useState } from 'react';
import { IconAlertCircle } from '@tabler/icons-react';
import { useSearchParams } from 'next/navigation';
import links from '@/app/links';

export default function LoginPage() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const searchParams = useSearchParams();

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

	const handleLogin = async ({ email, password }: { email: string; password: string }) => {
		setLoading(true);
		setError(null);

		await login(email, password)
			.then(() => (window.location.href = searchParams?.get('to') ?? links.home))
			.catch((error) => {
				const { code } = error;

				if (
					code === AuthErrorCodes.INVALID_PASSWORD ||
					code === AuthErrorCodes.INVALID_EMAIL ||
					code === AuthErrorCodes.USER_DELETED
				) {
					setError('invalid email or password');
				} else {
					setError('something went wrong, failed to login.');
					console.debug(error);
				}
			});

		setLoading(false);
	};

	return (
		<Container size="xs">
			<Paper radius="md" p="xl" withBorder>
				<Text size="md" weight={600} mb={10}>
					Welcome back
				</Text>

				{error && (
					<Alert icon={<IconAlertCircle size="1rem" />} color="red" my={10}>
						{error}
					</Alert>
				)}

				<form onSubmit={form.onSubmit(handleLogin)}>
					<Stack>
						<TextInput
							disabled={loading}
							required
							label="Email"
							placeholder="example@gmail.com"
							labelProps={{ style: { marginBottom: '5px' } }}
							value={form.values.email}
							onChange={(event) => form.setFieldValue('email', event.currentTarget.value)}
							error={form.errors.email && 'Invalid email'}
							radius="md"
						/>
						<PasswordInput
							disabled={loading}
							required
							label="Password"
							placeholder="Your password"
							labelProps={{ style: { marginBottom: '5px' } }}
							value={form.values.password}
							onChange={(event) => form.setFieldValue('password', event.currentTarget.value)}
							error={form.errors.password && 'Password should include at least 6 characters'}
							radius="md"
						/>
					</Stack>

					<Group position="right" mt="xl">
						<MediaQuery smallerThan="sm" styles={{ width: '100%' }}>
							<Button
								type="submit"
								radius="sm"
								color="primary"
								style={{ fontWeight: 'normal' }}
								disabled={loading}>
								{loading ? <Loader size={'sm'} /> : <>Login</>}
							</Button>
						</MediaQuery>
					</Group>
				</form>
			</Paper>
		</Container>
	);
}
