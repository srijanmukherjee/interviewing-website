'use client';

import { Divider, useMantineTheme, Text, Box, Accordion, Badge, Group, Anchor } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { modals } from '@mantine/modals';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import Error from 'next/error';
import Link from 'next/link';

import { EVALUATION_FAILURE_NOTIFICATION, EVALUATION_SUCCESS_NOTIFICATION } from '@/constants/notifications';
import { SubmissionGrading, SubmissionView, UserDetail } from '@/components/Submission';
import { questionsAtom, submissionsAtom, usersAtom } from '@/state';
import { notifications } from '@mantine/notifications';
import { IconExternalLink } from '@tabler/icons-react';
import { submissionService } from '@/services';
import { useAtom } from 'jotai';

const QuestionViewer = dynamic(() => import('@/components/QuestionViewer'));

interface Props {
	params: {
		uid: string;
		slug: string;
	};
}

export default function CheckSubmissionPage({ params: { uid, slug } }: Props) {
	const { colorScheme } = useMantineTheme();
	const [questions] = useAtom(questionsAtom);
	const [submissions] = useAtom(submissionsAtom);
	const [users] = useAtom(usersAtom);
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [submitted, setSubmitted] = useState<boolean>(false);
	const router = useRouter();

	const submission = submissions[uid]?.find((submission) => submission.slug === slug);
	if (!submission) return <Error statusCode={404} withDarkMode={colorScheme === 'dark'} />;

	const question = questions.find((question) => question.slug === submission.slug);
	if (!question) return <Error statusCode={404} withDarkMode={colorScheme === 'dark'} />;

	const user = users[submission.uid];

	const onSubmit = (grade: string, resubmitable: boolean, feedback: string | undefined) => {
		modals.openConfirmModal({
			title: 'Confirm',
			children: <Text>Are you sure you want to proceed with the evaluation?</Text>,
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			onConfirm: () => {
				setSubmitting(true);
				submissionService
					.gradeSubmission(submission!, grade, resubmitable, feedback)
					.then(() => {
						notifications.show(EVALUATION_SUCCESS_NOTIFICATION);
						setSubmitted(true);
						router.replace(`/submissions/view/${uid}/${slug}`);
					})
					.catch((error) => {
						notifications.show(EVALUATION_FAILURE_NOTIFICATION);
						console.log('Evaluation submission failed');
						console.error(error);
					})
					.finally(() => {
						setSubmitting(false);
					});
			},
		});
	};

	return (
		<>
			<Text size={32} mb="xl">
				Evaluate Submission
			</Text>
			<UserDetail user={user} />
			<Box>
				<Group spacing="xs">
					<Text size="xl" weight="bold" mt="xl" mb="sm">
						Question
					</Text>
					<Anchor component={Link} href={`/questions/view/${question.slug}`} target="_blank">
						<IconExternalLink size="1rem" />
					</Anchor>
				</Group>
				<Accordion>
					<Accordion.Item value="question">
						<Accordion.Control>
							<Group>
								<Text>{question.title}</Text>
								<Badge>{question.type}</Badge>
							</Group>
						</Accordion.Control>
						<Accordion.Panel>
							<QuestionViewer question={question} />
						</Accordion.Panel>
					</Accordion.Item>
				</Accordion>
			</Box>
			<SubmissionView submission={submission} question={question} />
			<Divider my="xl" />
			<SubmissionGrading onSubmit={onSubmit} submitting={submitting} submitted={submitted} />
		</>
	);
}
