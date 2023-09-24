import { useQuestion } from '@/context/QuestionContext';
import CodeSubmission from './CodeSubmission';
import { Flex, Text } from '@mantine/core';
import { IconAlertSquareRounded } from '@tabler/icons-react';
import useSubmissions from '@/hooks/useSubmissions';
import VideoSubmission from './VideoSubmission';
import TextSubmission from './TextSubmission';

export default function Submissions() {
	const { question } = useQuestion();
	const submission = useSubmissions(question.slug);

	if (!submission) {
		return (
			<Flex align="center" justify="center" direction="column" style={{ flex: 1 }}>
				<IconAlertSquareRounded color="gray" size={48} />
				<Text color="gray.6" mt={10} size="xl">
					No submissions
				</Text>
			</Flex>
		);
	}

	switch (question.type) {
		case 'coding':
			return <CodeSubmission />;

		case 'video':
			return <VideoSubmission />;

		case 'text':
			return <TextSubmission />;
	}
}
