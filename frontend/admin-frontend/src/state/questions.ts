import { Question } from '@/model';
import { atom } from 'jotai';

const questionsAtom = atom<Question[]>([]);

export default questionsAtom;
