export enum QuestionDifficulty {
	EASY = 'easy',
	MEDIUM = 'medium',
	HARD = 'hard',
}

export interface CodingQuestionParameter {
	memoryLimit: number;
	timeLimit: number;
}

export interface VideoQuestionParameter {
	durationLimit: number;
}

export interface TextQuestionParameter {
	characterLimit: number;
}

export interface BaseQuestion {
	slug: string;
	title: string;
	question: string;
	difficulty: QuestionDifficulty;
}

interface VideoQuestion extends BaseQuestion {
	type: 'video';
	parameters: VideoQuestionParameter;
}

interface CodingQuestion extends BaseQuestion {
	type: 'coding';
	parameters: CodingQuestionParameter;
}

interface TextQuestion extends BaseQuestion {
	type: 'text';
	parameters: TextQuestionParameter;
}

type Question = VideoQuestion | CodingQuestion | TextQuestion;

export default Question;
