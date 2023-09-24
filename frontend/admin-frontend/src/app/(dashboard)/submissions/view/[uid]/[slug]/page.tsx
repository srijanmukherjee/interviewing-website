'use client';

import QuestionViewer from '@/components/QuestionViewer';
import { SubmissionView, UserDetail } from '@/components/Submission';
import EvaluationResult from '@/components/Submission/EvaluationResult';
import { questionsAtom, submissionsAtom, usersAtom } from '@/state';
import { Accordion, Anchor, Badge, Box, Breadcrumbs, Divider, Group, Text, useMantineTheme } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import Error from 'next/error';
import Link from 'next/link';

interface Props {
	params: {
		slug: string;
		uid: string;
	};
}

export default function Submission({ params: { uid, slug } }: Props) {
	const { colorScheme } = useMantineTheme();
	const [questions] = useAtom(questionsAtom);
	const [submissions] = useAtom(submissionsAtom);
	const [users] = useAtom(usersAtom);

	const submission = submissions[uid]?.find((submission) => submission.slug === slug);
	if (!submission) return <Error statusCode={404} withDarkMode={colorScheme === 'dark'} />;

	const question = questions.find((question) => question.slug === submission.slug);
	if (!question) return <Error statusCode={404} withDarkMode={colorScheme === 'dark'} />;

	const user = users[submission.uid];

	const breadcrumbItems = [
		{ title: 'Submissions', href: '/submissions' },
		{ title: `${user.firstName} ${user.secondName}` },
		{ title: `${question.title}` },
	].map((item, index) =>
		item.href ? (
			<Anchor component={Link} href={item.href} key={index}>
				{item.title}
			</Anchor>
		) : (
			item.title
		)
	);

	return (
		<>
			<Breadcrumbs separator="→" mt="xs" mb="xl">
				{breadcrumbItems}
			</Breadcrumbs>
			<Text size={32} mb="xl">
				Submission
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
			<EvaluationResult submission={submission} />
		</>
	);
}
