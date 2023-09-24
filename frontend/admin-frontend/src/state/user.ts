import { User } from '@/model';
import { atom } from 'jotai';

export interface UsersType {
	[key: string]: User;
}

const usersAtom = atom<UsersType>({});

export default usersAtom;
