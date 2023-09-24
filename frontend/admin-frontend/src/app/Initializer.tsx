'use client';

import { PropsWithChildren, useEffect, useState } from 'react';
import { authService } from '@/services';
import { useAtom } from 'jotai';
import { authAtom, loggingInAtom, questionsAtom, submissionsAtom, usersAtom } from '@/state';
import { Loader, Transition } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { onValue, ref } from 'firebase/database';
import { database } from '@/config/firebase';
import { Submission } from '@/model';

function createSubmissionsArray(uid: string, data: any): Submission[] {
	const slugs = Object.keys(data[uid]);

	return slugs.map((slug) => ({
		...data[uid][slug],
		slug,
		uid,
	}));
}

export default function Initializer({ children }: PropsWithChildren) {
	const [auth, setAuth] = useAtom(authAtom);
	const [isLoaderVisible, setIsLoaderVisible] = useState<boolean>(true);
	const [loaded, setLoaded] = useState<boolean>(false);
	const [loadedQuestions, setLoadedQuestions] = useState<boolean>(false);
	const [loadedSubmissions, setLoadedSubmissions] = useState<boolean>(false);
	const [loadedUsers, setLoadedUsers] = useState<boolean>(false);
	const [loggingIn] = useAtom(loggingInAtom);
	const [, setQuestions] = useAtom(questionsAtom);
	const [, setSubmissions] = useAtom(submissionsAtom);
	const [, setUsers] = useAtom(usersAtom);
	const router = useRouter();

	// authenticate
	useEffect(() => {
		if (loggingIn) return;

		setAuth({
			loaded: false,
			user: null,
		});

		const unsubscribe = authService.auth.onAuthStateChanged((user) => {
			if (user == null && window.location.pathname !== '/login') {
				router.replace('/login');
			}

			if (user !== null && window.location.pathname === '/login') {
				router.replace('/');
			}

			setAuth({
				loaded: true,
				user,
			});
		});

		return () => {
			unsubscribe();
		};
	}, [setAuth, router, loggingIn]);

	// load data
	useEffect(() => {
		if (!auth.loaded) return;

		// no data to load
		if (auth.user === null) {
			setLoaded(true);
			return;
		}

		const questionsRef = ref(database, 'web/questions');
		const unsubscribeQuestions = onValue(questionsRef, (snapshot) => {
			if (snapshot) {
				const data = snapshot.val() ?? {};
				const slugs = Object.keys(data);
				const transformedQuestionArr = slugs.map((slug) => ({ ...data[slug], slug }));
				setQuestions(transformedQuestionArr);
			}

			setLoadedQuestions(true);
		});

		const submissionsRef = ref(database, 'web/submissions');
		const unsubscribeSubmissions = onValue(submissionsRef, (snapshot) => {
			if (snapshot) {
				const data = snapshot.val() ?? {};
				const uids = Object.keys(data);
				uids.forEach((uid) => (data[uid] = createSubmissionsArray(uid, data)));
				setSubmissions(data);
			}

			setLoadedSubmissions(true);
		});

		const usersRef = ref(database, 'coders');
		const unsubscribeUsers = onValue(usersRef, (snapshot) => {
			if (snapshot) {
				const data = snapshot.val() ?? {};
				Object.keys(data).forEach((uid) => (data[uid] = data[uid].attributes));
				setUsers(data);
			}

			setLoadedUsers(true);
		});

		return () => {
			unsubscribeQuestions();
			unsubscribeSubmissions();
			unsubscribeUsers();
		};
	}, [auth, setQuestions, setSubmissions, setUsers]);

	useEffect(() => {
		if (loaded) return;

		if (loadedSubmissions && loadedQuestions && loadedUsers) {
			setLoaded(true);
		}
	}, [loaded, loadedSubmissions, loadedQuestions, loadedUsers]);

	if (isLoaderVisible) {
		return (
			<Transition
				transition="fade"
				duration={400}
				exitDuration={400}
				mounted={!loaded}
				onExited={() => setIsLoaderVisible(false)}>
				{(styles) => (
					<Loader
						variant="bars"
						size="lg"
						style={{
							...styles,
							position: 'absolute',
							left: '50%',
							top: '50%',
							transform: 'translate(-50%, -50%)',
						}}
					/>
				)}
			</Transition>
		);
	}

	return children;
}
