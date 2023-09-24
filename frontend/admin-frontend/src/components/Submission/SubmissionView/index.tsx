import { Question, Submission } from '@/model';
import { Badge, Flex, Group, Paper, Text } from '@mantine/core';
import { Prism } from '@mantine/prism';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import dayjs from 'dayjs';
import humanizeDuration from 'humanize-duration';

interface Props {
	submission: Submission;
	question: Question;
}

function TextSubmissionView({ content }: { content: string }) {
	const editor = useEditor({
		extensions: [StarterKit],
		editable: false,
		content: atob(content),
	});

	return (
		<RichTextEditor editor={editor}>
			<RichTextEditor.Content />
		</RichTextEditor>
	);
}

export default function SubmissionView({ submission, question }: Props) {
	if (question.type === 'coding' && 'code' in submission.data) {
		return (
			<>
				<Text size="xl" mt="xl" weight="bolder">
					Submission
				</Text>

				<Group my="md" spacing="xs">
					<Badge color="dark" size="lg">
						Submitted on: {dayjs(submission.createdAt).format('YYYY-MMM-DD HH:mm:ss')}
					</Badge>
					<Badge size="lg">Language: {submission.data.code.language}</Badge>
				</Group>

				{/* @ts-ignore  */}
				<Prism language={submission.data.code.language} withLineNumbers>
					{atob(submission.data.code.content)}
				</Prism>
			</>
		);
	}

	if (question.type === 'video' && 'video' in submission.data) {
		return (
			<>
				<Text size="xl" mt="xl" weight="bolder">
					Submission
				</Text>

				<Group my="md" spacing="xs">
					<Badge color="dark" size="lg">
						Submitted on: {dayjs(submission.createdAt).format('YYYY-MMM-DD HH:mm:ss')}
					</Badge>
					<Badge size="lg">Duration limit: {humanizeDuration(question.parameters.durationLimit)}</Badge>
				</Group>

				<Flex justify="flex-start">
					<Paper
						shadow="xl"
						withBorder
						sx={(theme) => ({
							borderRadius: theme.radius.md,
							overflow: 'hidden',
							aspectRatio: '16 / 9',
							maxWidth: '1000px',
						})}>
						<video style={{ height: '100%', width: '100%' }} controls preload="auto">
							<source type="video/webm" src={submission.data.video.location} />
						</video>
					</Paper>
				</Flex>
			</>
		);
	}

	if (question.type === 'text' && 'text' in submission.data) {
		return (
			<>
				<Text size="xl" mt="xl" weight="bolder">
					Submission
				</Text>

				<Group my="md" spacing="xs">
					<Badge color="dark" size="lg">
						Submitted on: {dayjs(submission.createdAt).format('YYYY-MMM-DD HH:mm:ss')}
					</Badge>
				</Group>

				<TextSubmissionView content={submission.data.text.content} />
			</>
		);
	}

	return <></>;
}
