import { Submission } from '@/model';
import { atom } from 'jotai';

export interface SubmissionType {
	[key: string]: Submission[];
}

const submissionsAtom = atom<SubmissionType>({});

export default submissionsAtom;
