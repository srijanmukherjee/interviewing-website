import { Question, Submission } from '@/model';
import { questionService, submissionService } from '@/services';
import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { SubmissionType } from '@/state/submissions';
import { DELETE_FAILED_NOTIFICATION, DELETE_SUCCESSFUL_NOTFICATION } from '@/constants/notifications';
import lang from '@/constants/lang';

export const deleteQuestion = (question: Question, submissions: SubmissionType, callback?: () => void) => {
	const _submissions = Object.keys(submissions).map((uid) =>
		submissions[uid].find((submission) => submission.slug === question.slug)
	);

	const submissionsToDelete = _submissions.filter((value) => value !== undefined) as Submission[];

	modals.openConfirmModal({
		title: 'Confirm your action',
		confirmProps: { color: 'red' },
		children: <Text>{lang.PROMPT_DELETE_QUESTION(question.title)}</Text>,
		labels: { confirm: 'Delete', cancel: 'Cancel' },
		onConfirm: async () => {
			await Promise.all([
				submissionService.deleteSubmissions(submissionsToDelete),
				questionService
					.deleteQuestion(question)
					.then(() => {
						notifications.show(DELETE_SUCCESSFUL_NOTFICATION);
						if (callback) callback();
					})
					.catch(() => {
						notifications.show(DELETE_FAILED_NOTIFICATION);
					}),
			]);
		},
	});
};
