import { Box, Button, Group, SegmentedControl, Space, Stack, Switch, Text, Textarea } from '@mantine/core';
import { useState } from 'react';

interface Props {
	onSubmit: (grade: string, resubmitable: boolean, feedback: string | undefined) => void;
	submitting: boolean;
	submitted: boolean;
}

export default function SubmissionGrading({ onSubmit, submitting, submitted }: Props) {
	const [feedback, setFeedback] = useState<string>();
	const [grade, setGrade] = useState<string>('pass');
	const [resubmission, setResubmission] = useState<boolean>(false);

	const submit = () => {
		onSubmit(grade, resubmission, feedback);
	};

	return (
		<Box my="xl">
			<Text size="xl" weight="bold">
				Evaluation
			</Text>

			<Stack py="lg">
				<Textarea
					label="Feedback (optional)"
					value={feedback}
					onChange={(ev) => setFeedback(ev.currentTarget.value)}
					size="lg"
					disabled={submitting || submitted}
				/>

				<Group>
					<Text>Grade</Text>
					<SegmentedControl
						size="lg"
						data={[
							{
								value: 'pass',
								label: 'Pass',
							},
							{
								value: 'fail',
								label: 'Fail',
							},
						]}
						value={grade}
						onChange={setGrade}
						color={submitting ? undefined : grade === 'pass' ? 'green' : 'red'}
						disabled={submitting || submitted}
					/>
				</Group>
				<Space />
				<Switch
					label={'Allow resubmission?'}
					size="md"
					checked={resubmission}
					onChange={(ev) => setResubmission(ev.currentTarget.checked)}
					disabled={submitting || submitted}
				/>
			</Stack>
			<Button size="md" mt="sm" onClick={submit} loading={submitting} disabled={submitted}>
				{submitted ? 'Submitted' : submitting ? 'Submitting' : 'Submit'} evaluation
			</Button>
		</Box>
	);
}
