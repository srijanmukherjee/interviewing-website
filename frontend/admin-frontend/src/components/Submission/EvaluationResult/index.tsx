import { Submission } from '@/model';
import { Badge, Box, Group, Stack, Text, Textarea } from '@mantine/core';

interface Props {
	submission: Submission;
}

export default function EvaluationResult({ submission }: Props) {
	if (!submission.grade) return null;

	return (
		<Box>
			<Text size="xl" weight="bold" mb="lg">
				Result
			</Text>

			<Stack>
				<Group>
					<Text>Grade</Text>
					<Badge size="lg" color={submission.grade === 'pass' ? 'green' : 'red'}>
						{submission.grade}
					</Badge>
					{submission.resubmitable && <Badge>Resubmitable</Badge>}
				</Group>
				{submission.feedback && (
					<Textarea value={submission.feedback} contentEditable={false} label="Feedback" />
				)}
			</Stack>
		</Box>
	);
}
