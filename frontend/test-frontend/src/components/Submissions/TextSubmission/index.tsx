import { useQuestion } from '@/context/QuestionContext';
import useSubmissions from '@/hooks/useSubmissions';
import { Box } from '@mantine/core';
import { DisplaySubmissionStatus } from '../common/SubmissionStatus';
import SubmissionFeedback from '../common/Feedback';
import Metainformation from '../common/MetaInfo';
import { RichTextEditor } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';
import { useEditor } from '@tiptap/react';
import { useEffect } from 'react';

export default function TextSubmission() {
	const { question } = useQuestion();
	const submission = useSubmissions(question.slug);
	const editor = useEditor({
		extensions: [StarterKit],
		editable: false,
	});

	useEffect(() => {
		if (submission && editor) {
			editor.commands.setContent(atob(submission?.data.text?.content ?? 'Not availble'));
		}
	}, [submission, editor]);

	// should not happen
	if (!submission || question.type !== 'text' || !submission.data.text) return null;

	return (
		<Box>
			<DisplaySubmissionStatus grade={submission.grade} />
			<Metainformation submission={submission} />

			<RichTextEditor editor={editor}>
				<RichTextEditor.Content />
			</RichTextEditor>

			<SubmissionFeedback feedback={submission.feedback} />
		</Box>
	);
}
