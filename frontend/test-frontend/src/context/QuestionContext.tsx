import { Question } from '@/models';
import { PropsWithChildren, createContext, useContext } from 'react';

interface VideoPayload {
	blob: Blob;
}

interface CodePayload {
	content: string;
	language: string;
}

interface TextPayload {
	content: string;
}

export type QuestionOnSubmit = (payload: VideoPayload | CodePayload | TextPayload) => void;

export interface QuestionContextValue {
	question: Question;
	submitting: boolean;
	onSubmit: QuestionOnSubmit;
}

interface ProvicerProps extends PropsWithChildren, QuestionContextValue {}

const QuestionContext = createContext<QuestionContextValue | undefined>(undefined);

export function useQuestion() {
	const ctx = useContext(QuestionContext);

	if (!ctx) throw new Error('useQuestion called outside QuestionContext');

	return { question: ctx.question, submitting: ctx.submitting, onSubmit: ctx.onSubmit };
}

export function QuestionProvider({ children, question, submitting, onSubmit }: ProvicerProps) {
	return <QuestionContext.Provider value={{ question, submitting, onSubmit }}>{children}</QuestionContext.Provider>;
}
