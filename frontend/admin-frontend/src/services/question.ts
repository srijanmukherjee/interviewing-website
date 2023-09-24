import { database } from '@/config/firebase';
import { Question } from '@/model';
import { ref, remove, set } from 'firebase/database';

export async function createQuestion(question: Question) {
	const questionRef = ref(database, `web/questions/${question.slug}`);
	const questionWithoutSlug: any = question;
	delete questionWithoutSlug['slug'];
	return set(questionRef, questionWithoutSlug);
}

export async function deleteQuestion(question: Question) {
	const questionRef = ref(database, `web/questions/${question.slug}`);
	return remove(questionRef);
}
