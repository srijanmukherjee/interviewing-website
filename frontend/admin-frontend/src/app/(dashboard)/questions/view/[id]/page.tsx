'use client';

import { questionsAtom, submissionsAtom } from '@/state';
import { Anchor, Badge, Box, Breadcrumbs, Button, Divider, Group, Text } from '@mantine/core';
import { useAtom } from 'jotai';
import Error from 'next/error';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import { deleteQuestion } from '@/controller/deleteQuestion';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const QuestionViewer = dynamic(() => import('@/components/QuestionViewer'));
const SubmissionCountCard = dynamic(() => import('@/components/Cards/SubmissionCount'));

interface Props {
	params: {
		id: string;
	};
}

export default function QuestionView({ params }: Props) {
	const [questions] = useAtom(questionsAtom);
	const [submissions] = useAtom(submissionsAtom);
	const question = questions.find(({ slug }) => slug === params.id);
	const [submissionCount, setSubmissionsCount] = useState<number>(0);
	const router = useRouter();

	useEffect(() => {
		if (question && submissions) {
			const count = Object.keys(submissions).reduce(
				(count, uid) => count + (submissions[uid].findIndex((sub) => sub.slug === question.slug) > -1 ? 1 : 0),
				0
			);

			setSubmissionsCount(count);
		}
	}, [question, submissions]);

	if (!question) return <Error statusCode={404} withDarkMode={false} />;

	const breadcrumbItems = [
		{ title: 'Questions', href: '/questions' },
		{ title: question.title, href: `/questions/view/${question.slug}` },
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			{item.title}
		</Anchor>
	));

	return (
		<Box>
			<Breadcrumbs separator="→" mt="xs">
				{breadcrumbItems}
			</Breadcrumbs>

			<Text weight={500} size={32} mt="xl">
				{question.title}
			</Text>

			{/* Question meta information */}
			<Group my="lg" spacing="xs">
				<Badge>{question.type}</Badge>
				<Badge color="red">Difficulty: {question.difficulty}</Badge>
			</Group>

			<Group my="xl" spacing="sm">
				<Button
					variant="outline"
					size="xs"
					tt="uppercase"
					component={Link}
					href={`/submissions/view/question/${question.slug}`}>
					View submissions
				</Button>

				<Button
					variant="outline"
					color="gray"
					size="xs"
					tt="uppercase"
					leftIcon={<IconEdit size="1rem" />}
					component={Link}
					href={`/questions/edit/${question.slug}`}>
					Edit
				</Button>

				<Button
					variant="outline"
					color="red"
					size="xs"
					tt="uppercase"
					leftIcon={<IconTrash size="1rem" />}
					onClick={async () => {
						deleteQuestion(question, submissions, () => {
							router.replace('/questions');
						});
					}}>
					Delete
				</Button>
			</Group>

			<QuestionViewer question={question} />

			<Box>
				<Divider my="xl" />
				<Text size={'xl'} weight={600}>
					Activity
				</Text>

				<SubmissionCountCard count={submissionCount} />
			</Box>
		</Box>
	);
}
