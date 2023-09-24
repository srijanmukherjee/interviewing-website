import { Question } from '@/model';
import { QuestionEditorState } from './_context';
import { BaseQuestion } from '@/model/question';

export function createSlug(str: string) {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, '')
		.replace(/[\s_-]+/g, '-')
		.replace(/^-+|-+$/g, '');
}

export function createQuestion({
	difficulty,
	slug,
	title,
	content,
	type,
	parameters,
}: QuestionEditorState): Question | undefined {
	const baseQuestion: BaseQuestion = {
		difficulty,
		title,
		slug,
		question: content!,
	};

	let question: Question | undefined = undefined;

	if (type === 'video') {
		question = {
			...baseQuestion,
			type: 'video',
			parameters: {
				durationLimit: parameters.durationLimit * 60 * 1000,
			},
		};
	} else if (type === 'coding') {
		question = {
			...baseQuestion,
			type: 'coding',
			parameters: {
				memoryLimit: parameters.memoryLimit,
				timeLimit: parameters.timeLimit,
			},
		};
	} else if (type === 'text') {
		question = {
			...baseQuestion,
			type: 'text',
			parameters: {
				characterLimit: parameters.characterLimit,
			},
		};
	}

	return question;
}
