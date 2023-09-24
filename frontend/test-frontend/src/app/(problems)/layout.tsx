'use client';

import ProviderLayout from '@/components/ProviderLayout';
import { database } from '@/config/firebaseConfig';
import { userAtom } from '@/state/auth';
import { questionsAtom, questionsLoadedAtom } from '@/state/question';
import { submissionsAtom } from '@/state/submissions';
import { transformIntoQuestions } from '@/util/data';
import { onValue, ref } from 'firebase/database';
import { useAtom } from 'jotai';
import { PropsWithChildren, useEffect } from 'react';

// Add language support for prism
// @ts-ignore
import Prism from 'prism-react-renderer/prism';

// @ts-ignore
if (process.browser) {
	// @ts-ignore
	(typeof global !== 'undefined' ? global : window).Prism = Prism;
	require('prismjs/components/prism-kotlin');
	require('prismjs/components/prism-csharp');
	require('prismjs/components/prism-swift');
}

export default function Layout({ children }: PropsWithChildren) {
	const [user] = useAtom(userAtom);
	const [, setSubmissions] = useAtom(submissionsAtom);
	const [, setQuestionsLoaded] = useAtom(questionsLoadedAtom);
	const [, setQuestions] = useAtom(questionsAtom);

	// fetch user submissions and questions
	useEffect(() => {
		if (!user) return;

		setQuestionsLoaded(false);

		const submissionsRef = ref(database, `web/submissions/${user.uid}`);
		const questionsRef = ref(database, 'web/questions');

		const unsubscribeSubmissions = onValue(submissionsRef, (snapshot) => {
			if (!snapshot) return;
			setSubmissions(snapshot.val());
		});

		const unsubscriveQuestions = onValue(questionsRef, (snapshot) => {
			setQuestionsLoaded(true);
			if (!snapshot) return;
			setQuestions(transformIntoQuestions(snapshot.val()));
		});

		return () => {
			unsubscribeSubmissions();
			unsubscriveQuestions();
		};
	}, [user, setSubmissions, setQuestions, setQuestionsLoaded]);

	useEffect(() => {
		const previousTitle = document.title;

		document.title = `Problems | ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`;

		return () => {
			document.title = previousTitle;
		};
	}, []);

	return <ProviderLayout>{children}</ProviderLayout>;
}
