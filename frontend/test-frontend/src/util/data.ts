import { Question } from '@/models';
import { SubmissionStatus, UserSubmissions } from '@/models/submission';

/**
 * Converts questions data from firebase into Question type
 *
 * @param data
 * @returns {Question[]} list of questions
 */
export function transformIntoQuestions(data: any): Question[] {
	if (data === undefined || data === null) return [];

	return Object.keys(data).map((slug) => ({
		...data[slug],
		slug,
	}));
}

export function mergeQuestionsAndSubmissions(questions: Question[], submissions: UserSubmissions): Question[] {
	if (!submissions) return questions;

	return questions.map((question) => {
		const submission = submissions[question.slug];

		if (!submission) question.status = SubmissionStatus.UNATTEMPTED;
		else if (submission.grade === 'pass') question.status = SubmissionStatus.PASS;
		else if (submission.grade === 'fail') question.status = SubmissionStatus.FAIL;
		else question.status = SubmissionStatus.SUBMITTED;

		return question;
	});
}
