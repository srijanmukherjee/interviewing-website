import { Question } from '@/models';
import { questionsAtom, questionsLoadedAtom } from '@/state/question';
import { useAtom } from 'jotai';

export default function useQuestion(slug: string): [boolean, Question | undefined] {
	const [questions] = useAtom(questionsAtom);
	const [questionsLoaded] = useAtom(questionsLoadedAtom);
	return [questionsLoaded, questions.find((question) => question.slug === slug)];
}
