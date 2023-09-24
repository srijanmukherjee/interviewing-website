import { database } from '@/config/firebase';
import { Submission } from '@/model';
import { SubmissionType } from '@/state/submissions';
import { ref, serverTimestamp, update } from 'firebase/database';

export function unpackSubmissions(submissions: SubmissionType): Submission[] {
	return Object.keys(submissions).flatMap((uid) => [...submissions[uid]]);
}

export function deleteSubmissions(submissions: Submission[]) {
	const submissionsRef = ref(database, 'web/submissions/');
	const submissionsToDelete = submissions.reduce((del, submission) => {
		del[`${submission.uid}/${submission.slug}`] = null;
		return del;
	}, {} as any);
	return update(submissionsRef, submissionsToDelete);
}

export function gradeSubmission(
	submission: Submission,
	grade: string,
	resubmitable: boolean,
	feedback: string | undefined
) {
	const submissionRef = ref(database, `web/submissions/${submission.uid}/${submission.slug}`);

	return update(submissionRef, {
		grade,
		resubmitable,
		feedback: feedback ?? null,
		gradedOn: serverTimestamp(),
	});
}
