import SubmissionCountCard from '@/components/Cards/SubmissionCount';
import { submissionsAtom } from '@/state';
import { useAtom } from 'jotai';

export default function SubmissionsCard() {
	const [submissions] = useAtom(submissionsAtom);
	const count = Object.keys(submissions).reduce((result, user) => result + submissions[user].length, 0);
	return <SubmissionCountCard count={count} />;
}
