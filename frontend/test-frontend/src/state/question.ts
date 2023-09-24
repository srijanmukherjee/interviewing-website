import { Question } from '@/models/question';
import { atom } from 'jotai';

export const questionsAtom = atom<Question[]>([]);
export const questionsLoadedAtom = atom<boolean>(false);
