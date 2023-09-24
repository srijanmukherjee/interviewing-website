import { useQuestion } from '@/context/QuestionContext';
import useSubmissions from '@/hooks/useSubmissions';
import { Box } from '@mantine/core';
import { DisplaySubmissionStatus } from '../common/SubmissionStatus';
import SubmissionFeedback from '../common/Feedback';
import Metainformation from '../common/MetaInfo';

export default function VideoSubmission() {
	const { question } = useQuestion();
	const submission = useSubmissions(question.slug);

	// should not happen
	if (!submission || question.type !== 'video' || !submission.data.video) return null;

	return (
		<Box>
			<DisplaySubmissionStatus grade={submission.grade} />
			<Metainformation submission={submission} />
			<Box style={{ aspectRatio: 16 / 9, borderRadius: '5px', overflow: 'hidden' }} mt={10}>
				<video src={submission.data.video.location} controls width="100%" height="100%" preload="auto" />
			</Box>

			<SubmissionFeedback feedback={submission.feedback} />
		</Box>
	);
}
