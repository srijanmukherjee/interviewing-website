'use client';

import { Flex, Loader, Paper, Tabs } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { useEffect, useMemo, useState } from 'react';
import Split from 'react-split';
import { useAtom } from 'jotai';

import QuestionDescription from '@/components/QuestionDescription';
import Submissions from '@/components/Submissions';
import { useStyles } from './style';

import { NavbarType, navbarTypeAtom } from '@/state/navbar';
import { userAtom } from '@/state/auth';
import useQuestion from '@/hooks/useQuestion';
import { HEADER_HEIGHT } from '@/components/Header';
import Error from 'next/error';
import { QuestionOnSubmit, QuestionProvider } from '@/context/QuestionContext';
import { submissionsAtom } from '@/state/submissions';
import dynamic from 'next/dynamic';
import { createSolutionSubmitter } from '@/controller/submission';

const SolutionArea = dynamic(() => import('@/components/SolutionArea'));

interface Props {
	params: {
		slug: string;
	};
}

/**
 * QuestionView
 * Shows question description, submissions, solution area
 */
export default function QuestionView({ params }: Props) {
	const { classes } = useStyles();
	const [currentTab, setCurrentTab] = useState<string | null>('description');
	const [submitting, setSubmitting] = useState<boolean>(false);
	const [user] = useAtom(userAtom);
	const [, setNavbarType] = useAtom(navbarTypeAtom);
	const [questionsLoaded, question] = useQuestion(params.slug);
	const [submissions] = useAtom(submissionsAtom);
	const solutionSubmitter = useMemo(
		() => createSolutionSubmitter(question, submissions, user),
		[question, submissions, user]
	);

	const submitCode = async (content: string, language: string) => {
		setSubmitting(true);
		await solutionSubmitter
			.submitCode(content, language)
			.then(() => setCurrentTab('submissions'))
			.catch(console.error);
		setSubmitting(false);
	};

	const submitVideo = async (blob: Blob) => {
		setSubmitting(true);
		await solutionSubmitter
			.submitVideo(blob)
			.then(() => setCurrentTab('submissions'))
			.catch(console.error);
		setSubmitting(false);
	};

	const submitText = async (content: string) => {
		setSubmitting(true);
		await solutionSubmitter
			.submitText(content)
			.then(() => setCurrentTab('submissions'))
			.catch(console.error);
		setSubmitting(false);
	};

	const onSubmit: QuestionOnSubmit = (payload) => {
		if (!question) return;

		if ('blob' in payload && question.type === 'video') {
			submitVideo(payload.blob);
		} else if ('content' in payload && 'language' in payload && question.type === 'coding') {
			submitCode(payload.content, payload.language);
		} else if (question.type === 'text' && 'content' in payload) {
			submitText(payload.content);
		}
	};

	// change header in problem page
	useEffect(() => {
		if (!question) return;

		setNavbarType(NavbarType.Question);

		return () => {
			setNavbarType(NavbarType.Normal);
		};
	}, [setNavbarType, question]);

	// change document title
	useEffect(() => {
		const previousTitle = document.title;
		if (question) document.title = `${question.title} | ${process.env.NEXT_PUBLIC_APPLICATION_NAME}`;
		return () => {
			document.title = previousTitle;
		};
	}, [question]);

	if (!questionsLoaded) {
		return (
			<Flex align="center" justify="center" style={{ height: `calc(100vh - ${HEADER_HEIGHT})` }}>
				<Loader size="sm" />
			</Flex>
		);
	}

	// not found
	if (!question) {
		return (
			<Flex className={classes.error404}>
				<Error statusCode={404} />
			</Flex>
		);
	}

	return (
		<QuestionProvider question={question} submitting={submitting} onSubmit={onSubmit}>
			<div style={{ padding: '5px' }}>
				<Split className={classes.split} gutterSize={6} minSize={300}>
					<div>
						<Tabs value={currentTab} onTabChange={setCurrentTab} className={classes.tabs}>
							<Tabs.List>
								<Tabs.Tab value="description">Description</Tabs.Tab>
								<Tabs.Tab value="submissions">Submissions</Tabs.Tab>
							</Tabs.List>

							<Paper className={classes.panelContainer}>
								<Tabs.Panel value="description">
									<QuestionDescription />
								</Tabs.Panel>
								<Tabs.Panel
									value="submissions"
									style={{
										minHeight: '100%',
										flexDirection: 'column',
										display: currentTab === 'submissions' ? 'flex' : undefined,
									}}>
									<Submissions />
								</Tabs.Panel>
							</Paper>
						</Tabs>
					</div>
					<div>
						<SolutionArea />
					</div>
				</Split>
			</div>
			<Notifications position="bottom-left" />
		</QuestionProvider>
	);
}
