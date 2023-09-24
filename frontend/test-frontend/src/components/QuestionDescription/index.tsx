'use client';

import { Badge, Group, Skeleton } from '@mantine/core';
import { useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { marked } from 'marked';
import Link from 'next/link';

import QuestionSkeleton from './QuestionSkeleton';
import { useStyles } from './style';
import { useQuestion } from '@/context/QuestionContext';

interface Props {}

const difficultyColor: { [index: string]: string } = {
	hard: 'red',
	medium: 'yellow',
	easy: 'teal',
};

export default function QuestionDescription({}: Props) {
	const { classes } = useStyles();
	const { question } = useQuestion();
	const questionRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!question || !questionRef.current) return;
		questionRef.current.innerHTML = DOMPurify.sanitize(
			marked.parse(
				question.question.replaceAll('\\n', '\n').replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '')
			)
		);
	}, [question, questionRef]);

	return (
		<>
			<Skeleton
				height={question === null ? '1.25rem' : undefined}
				width={question === null ? '30%' : '100%'}
				visible={question === null}
				mb={10}>
				<Link href={`/problems/${question?.slug}`} className={classes.title}>
					{question?.title}
				</Link>
			</Skeleton>
			<Skeleton visible={question === null}>
				<Group spacing="xs">
					<Badge
						tt="capitalize"
						size="lg"
						color={question?.difficulty ? difficultyColor[question.difficulty] : undefined}>
						{question?.difficulty}
					</Badge>
					<Badge tt="capitalize" size="lg" color="primary">
						{question?.type}
					</Badge>
				</Group>
			</Skeleton>
			<QuestionSkeleton visible={question === null}>
				<div ref={questionRef} className={classes.question} />
			</QuestionSkeleton>
		</>
	);
}
