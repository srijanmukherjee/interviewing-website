import { User } from '@/model';
import { Avatar, Box, Group, Text } from '@mantine/core';

interface Props {
	user: User;
}

export default function UserDetail({ user }: Props) {
	return (
		<Box>
			<Text mb="lg" size="xl" weight="bold">
				Submitted By
			</Text>
			<Group spacing="sm" position="left" align="center">
				<Avatar size="xl" m={0} color="indigo" radius="xl" />
				<Box>
					<Text size="xl">
						{user.firstName} {user.secondName}
					</Text>
					<Text color="dimmed" size="sm">
						{user.email}
					</Text>
					<Text color="dimmed" weight="bold" size="sm" mt={5}>
						{user.devType}
					</Text>
				</Box>
			</Group>
		</Box>
	);
}
