import { SubmissionStatus } from './submission';

enum QuestionType {
	coding = 'coding',
	video = 'video',
	text = 'text',
}

export interface Question {
	slug: string;
	title: string;
	question: string;
	difficulty: 'easy' | 'hard' | 'medium';
	parameters: {
		memoryLimit?: number;
		timeLimit?: number;
		durationLimit?: number;
		characterLimit?: number;
	};
	type: QuestionType;
	status?: SubmissionStatus;
}
