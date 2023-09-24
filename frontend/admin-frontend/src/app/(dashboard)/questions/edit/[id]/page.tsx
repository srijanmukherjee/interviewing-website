'use client';

import { Question } from '@/model';
import { questionsAtom } from '@/state';
import { Flex, Loader } from '@mantine/core';
import { useAtom } from 'jotai';
import dynamic from 'next/dynamic';
import Error from 'next/error';
import { useEffect, useState } from 'react';

const QuestionEditor = dynamic(() => import('@/components/QuestionEditor'));

interface Props {
	params: {
		id: string;
	};
}

export default function EditQuestionPage({ params }: Props) {
	const [questions] = useAtom(questionsAtom);
	const [question, setQuestion] = useState<Question>();
	const [findingQuestions, setFindingQuestions] = useState<boolean>(true);

	useEffect(() => {
		const _question = questions.find((question) => question.slug === params.id);
		setQuestion(_question);
		setFindingQuestions(false);
	}, [questions, params]);

	if (findingQuestions) {
		return (
			<Flex h="95vh" align="center" justify="center">
				<Loader variant="bars" />
			</Flex>
		);
	}

	if (!question) {
		return <Error statusCode={404} withDarkMode={false} />;
	}

	return <QuestionEditor question={question} />;
}
