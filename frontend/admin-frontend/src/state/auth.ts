import { AuthModel } from '@/model';
import { atom } from 'jotai';

const authAtom = atom<AuthModel>({
	loaded: false,
	user: null,
});

export default authAtom;
