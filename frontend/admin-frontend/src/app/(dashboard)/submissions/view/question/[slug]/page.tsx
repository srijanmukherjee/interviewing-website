'use client';

import { submissionService } from '@/services';
import { questionsAtom, submissionsAtom } from '@/state';
import { Accordion, Anchor, Badge, Box, Breadcrumbs, Group, Text, useMantineTheme } from '@mantine/core';
import { IconExternalLink } from '@tabler/icons-react';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Error from 'next/error';
import Link from 'next/link';
import { useMemo } from 'react';

const SubmissionTable = dynamic(() => import('@/components/Submission/SubmissionTable'));
const QuestionViewer = dynamic(() => import('@/components/QuestionViewer'));

interface Props {
	params: {
		slug: string;
	};
}

export default function QuestionSubmissions({ params }: Props) {
	const theme = useMantineTheme();
	const [questions] = useAtom(questionsAtom);
	const [submissions] = useAtom(submissionsAtom);
	const submissionsList = useMemo(() => submissionService.unpackSubmissions(submissions), [submissions]);
	const question = questions.find((question) => question.slug === params.slug);

	if (!question) return <Error statusCode={404} withDarkMode={theme.colorScheme === 'dark'} />;

	const questionSubmissions = submissionsList.filter((submission) => submission.slug === question.slug);

	const breadcrumbItems = [
		{ title: 'Submissions', href: '/submissions' },
		{ title: `${question.title}`, href: `/submissions/view/question/${question.slug}` },
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			{item.title}
		</Anchor>
	));

	return (
		<Box>
			<Breadcrumbs separator="→" mt="xs" mb="xl">
				{breadcrumbItems}
			</Breadcrumbs>
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
			<Box my="xl">
				<Text size="xl" weight="bold" mb="lg">
					Submissions
				</Text>
				<SubmissionTable submissions={questionSubmissions} showStatus showQuestion={false} />
			</Box>
		</Box>
	);
}
