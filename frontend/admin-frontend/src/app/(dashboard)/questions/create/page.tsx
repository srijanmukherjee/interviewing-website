'use client';

import dynamic from 'next/dynamic';

const QuestionEditor = dynamic(() => import('@/components/QuestionEditor'));

export default function CreateQuestionPage() {
	return <QuestionEditor />;
}
