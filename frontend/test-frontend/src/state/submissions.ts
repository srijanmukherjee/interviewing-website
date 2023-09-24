import { UserSubmissions } from '@/models';
import { atom } from 'jotai';

export const submissionsAtom = atom<UserSubmissions>({});
