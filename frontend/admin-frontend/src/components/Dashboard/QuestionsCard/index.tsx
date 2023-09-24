import { questionsAtom } from '@/state';
import { Box, Flex, Group, Paper, Text, ThemeIcon } from '@mantine/core';
import { IconGitPullRequest } from '@tabler/icons-react';
import { useAtom } from 'jotai';

export default function QuestionsCard() {
	const [questions] = useAtom(questionsAtom);

	return (
		<Paper withBorder p="xl" shadow="xl" style={{ width: '100%' }}>
			<Flex align={'center'}>
				<ThemeIcon color="yellow" variant="light" size="4rem">
					<IconGitPullRequest size="7.5rem" />
				</ThemeIcon>

				<Group position="right" style={{ flex: 1 }}>
					<Box>
						<Text tt="uppercase" size="xs">
							Questions
						</Text>
						<Text ta="right" size={32} weight="bold">
							{questions.length}
						</Text>
					</Box>
				</Group>
			</Flex>
		</Paper>
	);
}
