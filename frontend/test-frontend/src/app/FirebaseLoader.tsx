'use client';

import auth from '@/service/auth';
import { authenticatingAtom, userAtom } from '@/state/auth';
import { removeCookie, setCookie } from 'typescript-cookie';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

function removeSensitiveData() {
	// removed cached codes of logged out user
	for (const key in localStorage) {
		if (key.startsWith('editor/content')) {
			localStorage.removeItem(key);
		}
	}
}

/**
 * manages user state during logins and logouts
 */
export default function FirebaseLoader() {
	const [, setUser] = useAtom(userAtom);
	const [, setAuthenticating] = useAtom(authenticatingAtom);

	useEffect(() => {
		setAuthenticating(true);

		const unsubscribe = auth.onAuthStateChanged((user) => {
			setUser(user);
			setAuthenticating(false);
			if (user) setCookie('auth', 1);
			else {
				removeCookie('auth');
				removeSensitiveData();
			}
		});

		return unsubscribe;
	}, [setAuthenticating, setUser]);

	return null;
}
