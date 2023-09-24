import { useQuestion } from '@/context/QuestionContext';
import useSubmissions from '@/hooks/useSubmissions';
import { Badge, Box, Code, Divider, Group, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { Prism } from '@mantine/prism';
import { DisplaySubmissionStatus } from '../common/SubmissionStatus';
import { IconMessage } from '@tabler/icons-react';
import SubmissionFeedback from '../common/Feedback';
import Metainformation from '../common/MetaInfo';

export default function CodeSubmission() {
	const { question } = useQuestion();
	const submission = useSubmissions(question.slug);

	// should not happen
	if (!submission || question.type !== 'coding' || !submission.data.code) return null;

	return (
		<Box>
			<DisplaySubmissionStatus grade={submission.grade} />
			<Metainformation submission={submission}>
				<Badge color="secondary" size="lg">
					Language: {submission.data.code.language}
				</Badge>
			</Metainformation>

			{/* @ts-ignore */}
			<Prism withLineNumbers language={submission.data.code.language}>
				{atob(submission.data.code.content)}
			</Prism>

			<SubmissionFeedback feedback={submission.feedback} />
		</Box>
	);
}
