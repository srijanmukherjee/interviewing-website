import { Question, UserSubmissions } from '@/models';
import { submitCodingAnswer, submitTextAnswer, submitVideoAnswer } from '@/service/submission';
import { NOTIFY_NOT_LOGGED_IN, NOTIFY_SUBMISSION_RECEIVED } from '@/util/notification';
import { notifications } from '@mantine/notifications';
import { User } from 'firebase/auth';

export function createSolutionSubmitter(
	question: Question | undefined,
	submissions: UserSubmissions | undefined,
	user: User | null
) {
	const prevalidation = () => {
		if (!question) return false;

		// This case shouldn't ever happen
		if (!user) {
			notifications.show(NOTIFY_NOT_LOGGED_IN);
			return false;
		}

		const submission = (submissions ?? {})[question.slug];

		if (submission && submission.resubmitable === false) {
			notifications.show({
				title: 'Warning',
				message: 'Your submission has already been accepted',
				color: 'secondary',
			});

			return false;
		}

		return true;
	};

	return {
		submitCode: async (content: string, language: string) => {
			if (!prevalidation()) return;

			return submitCodingAnswer(user!.uid, question!, content.trim(), language).then(() => {
				notifications.show(NOTIFY_SUBMISSION_RECEIVED);
			});
		},

		submitVideo: async (video: Blob) => {
			if (!prevalidation()) return;

			return submitVideoAnswer(user!.uid, question!, video).then(() =>
				notifications.show(NOTIFY_SUBMISSION_RECEIVED)
			);
		},

		submitText: async (content: string) => {
			if (!prevalidation()) return;

			return submitTextAnswer(user!.uid, question!, content).then(() =>
				notifications.show(NOTIFY_SUBMISSION_RECEIVED)
			);
		},
	};
}
