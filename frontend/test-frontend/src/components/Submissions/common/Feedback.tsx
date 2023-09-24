import { Divider, Box, Group, Title, Code } from '@mantine/core';
import { IconMessage } from '@tabler/icons-react';

export default function SubmissionFeedback({ feedback }: { feedback?: string }) {
	if (!feedback) return null;
	return (
		<>
			<Divider my={20} />
			<Box>
				<Group spacing={10} align="center">
					<IconMessage size={24} />
					<Title order={3}>Feedback</Title>
				</Group>

				<Code block my={10}>
					{feedback}
				</Code>
			</Box>
		</>
	);
}
