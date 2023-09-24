import Editor from '../Editor';
import { Flex } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useQuestion } from '@/context/QuestionContext';
import TextSolution from './TextSolution';

const VideoRecorder = dynamic(() => import('@/components/VideoRecorder'), { ssr: false });

export default function SolutionArea() {
	const { question } = useQuestion();

	if (question.type === 'coding') return <Editor />;
	if (question.type === 'video') return <VideoRecorder />;
	if (question.type === 'text') return <TextSolution />;

	return (
		<Flex align="center" justify="center" h="100%">
			Question type not supported, contact admin.
		</Flex>
	);
}
