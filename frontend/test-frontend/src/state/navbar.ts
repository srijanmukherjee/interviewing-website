import { atom } from 'jotai';

export enum NavbarType {
	Normal,
	Question,
}

export const navbarTypeAtom = atom<NavbarType>(NavbarType.Normal);
