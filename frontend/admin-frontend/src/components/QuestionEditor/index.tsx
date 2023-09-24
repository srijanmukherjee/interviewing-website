import { Question } from '@/model';
import { Box, Divider } from '@mantine/core';
import { QuestionEditorContextProvider } from './_context';
import Header from './_header';
import TitleInput from './_titleInput';
import DifficultyInput from './_difficultyInput';
import TypeInput from './_typeInput';
import { useState } from 'react';
import { notifications } from '@mantine/notifications';
import { questionService } from '@/services';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const DescriptionEditor = dynamic(() => import('./_description'));

interface Props {
	question?: Question;
}

/**
 * Question editor
 * @param { Question } question when question is provided, editing mode is on, else off
 */
export default function QuestionEditor({ question }: Props) {
	const [submitting, setSubmitting] = useState<boolean>(false);
	const router = useRouter();

	const onSubmit = (question: Question | undefined) => {
		if (!question) {
			return notifications.show({
				title: 'Error',
				message: 'Question type not supported yet. Please contact developer',
				withBorder: true,
				styles: (theme) => ({
					root: {
						backgroundColor: theme.colors.red[6],
						borderColor: theme.colors.red[6],

						'&::before': { backgroundColor: theme.white },
					},

					title: { color: theme.white },
					description: { color: theme.white },
					closeButton: {
						color: theme.white,
						'&:hover': { backgroundColor: theme.colors.red[7] },
					},
				}),
			});
		}

		setSubmitting(true);

		const slug = question.slug;

		questionService
			.createQuestion(question)
			.then(() => {
				notifications.show({
					title: 'Posted',
					message: `Question is now live @ https://freelancing-delta.vercel.app/problems/${slug}`,
					withBorder: true,
					styles: (theme) => ({
						root: {
							backgroundColor: theme.colors.green[6],
							borderColor: theme.colors.green[6],

							'&::before': { backgroundColor: theme.white },
						},

						title: { color: theme.white },
						description: { color: theme.white },
						closeButton: {
							color: theme.white,
							'&:hover': { backgroundColor: theme.colors.green[7] },
						},
					}),
				});
				router.replace(`/questions/view/${slug}`);
			})
			.catch(() => {
				notifications.show({
					title: 'Error',
					message: 'Failed to post question, please try again later',
					withBorder: true,
					styles: (theme) => ({
						root: {
							backgroundColor: theme.colors.red[6],
							borderColor: theme.colors.red[6],

							'&::before': { backgroundColor: theme.white },
						},

						title: { color: theme.white },
						description: { color: theme.white },
						closeButton: {
							color: theme.white,
							'&:hover': { backgroundColor: theme.colors.red[7] },
						},
					}),
				});
			})
			.finally(() => {
				setSubmitting(false);
			});
	};

	return (
		<Box>
			<QuestionEditorContextProvider question={question} submitting={submitting} onSubmit={onSubmit}>
				<Header />
				<TitleInput />
				<Divider my="xl" />
				<DifficultyInput />
				<TypeInput />
				<Divider my="xl" />
				<DescriptionEditor />
			</QuestionEditorContextProvider>
		</Box>
	);
}
