import { difficultyColor } from '@/app/(problems)/problems/util';
import { questionsAtom, questionsLoadedAtom } from '@/state/question';
import { submissionsAtom } from '@/state/submissions';
import { Text, RingProgress, Center, Group, Flex, useMantineTheme } from '@mantine/core';
import { IconCircleFilled } from '@tabler/icons-react';
import { useAtom } from 'jotai';

export default function ProblemsStatus() {
	const theme = useMantineTheme();
	const [questions] = useAtom(questionsAtom);
	const [questionsLoaded] = useAtom(questionsLoadedAtom);
	const [submissions]: any = useAtom(submissionsAtom);

	if (!questionsLoaded) return null;

	const keys = Object.keys(submissions ?? {});

	const failCount = keys.filter((key) => submissions[key].grade === 'fail').length;
	const passCount = keys.filter((key) => submissions[key].grade === 'pass').length;
	const submissionsCount = keys.length - (passCount + failCount);
	const totalCount = questions.length;

	const questionDifficultyMap = questions.reduce((val: any, curr) => ({ ...val, [curr.slug]: curr.difficulty }), {});

	const totalSubmissions = keys.length;
	const hardQuestionsCount = keys.filter((key) => questionDifficultyMap[key] === 'hard').length;
	const mediumQuestionsCount = keys.filter((key) => questionDifficultyMap[key] === 'medium').length;
	const easyQuestionsCount = keys.filter((key) => questionDifficultyMap[key] === 'easy').length;

	return (
		<Flex my={20} gap={30} wrap="wrap">
			<Group>
				<RingProgress
					sections={[
						{
							value: (submissionsCount * 100) / questions.length,
							color: 'secondary.6',
							tooltip: 'Submitted',
						},
						{
							value: (failCount * 100) / questions.length,
							color: 'red',
							tooltip: 'Failed',
						},
						{
							value: (passCount * 100) / questions.length,
							color: 'green.6',
							tooltip: 'Passed',
						},
						{
							value: ((totalCount - totalSubmissions) * 100) / questions.length,
							color: 'white',
							tooltip: 'Unattempted',
						},
					]}
					size={100}
					label={
						<Center>
							<Text size="sm" weight="bold">
								{totalSubmissions}/{totalCount}
							</Text>
						</Center>
					}
				/>
				<Flex direction="column">
					<Flex align="center" gap={5}>
						<IconCircleFilled size={8} style={{ color: 'white' }} />
						<Text inline color={'white'}>
							{totalCount - totalSubmissions}
						</Text>
						<Text>unattempted</Text>
					</Flex>
					<Flex align="center" gap={5}>
						<IconCircleFilled size={8} style={{ color: theme.colors.secondary[6] }} />
						<Text inline color={theme.colors.secondary[6]}>
							{submissionsCount}
						</Text>
						<Text>unchecked</Text>
					</Flex>
					<Flex align="center" gap={5}>
						<IconCircleFilled size={8} style={{ color: theme.colors.red[9] }} />
						<Text inline color={theme.colors.red[9]}>
							{failCount}
						</Text>
						<Text>failed</Text>
					</Flex>
					<Flex align="center" gap={5}>
						<IconCircleFilled size={8} style={{ color: theme.colors.green[9] }} />
						<Text inline color={theme.colors.green[9]}>
							{passCount}
						</Text>
						<Text>passed</Text>
					</Flex>
				</Flex>
			</Group>
			<Group>
				<RingProgress
					sections={
						keys.length > 0
							? [
									{
										value: (easyQuestionsCount * 100) / totalSubmissions,
										color: difficultyColor['easy'],
										tooltip: 'Easy',
									},
									{
										value: (mediumQuestionsCount * 100) / totalSubmissions,
										color: difficultyColor['medium'],
										tooltip: 'Medium',
									},
									{
										value: (hardQuestionsCount * 100) / totalSubmissions,
										color: difficultyColor['hard'],
										tooltip: 'Hard',
									},
							  ]
							: [{ value: 100, color: 'white', tooltip: 'Unattempted' }]
					}
					label={
						<Center>
							<Text size="xs">Difficulty</Text>
						</Center>
					}
					size={100}
				/>
				<Flex direction="column">
					<Flex align="center" gap={5}>
						<IconCircleFilled size={8} style={{ color: theme.fn.themeColor(difficultyColor['easy']) }} />
						<Text inline color={difficultyColor['easy']}>
							{easyQuestionsCount}
						</Text>
						<Text>easy</Text>
					</Flex>
					<Flex align="center" gap={5}>
						<IconCircleFilled size={8} style={{ color: theme.fn.themeColor(difficultyColor['medium']) }} />
						<Text inline color={difficultyColor['medium']}>
							{mediumQuestionsCount}
						</Text>
						<Text>medium</Text>
					</Flex>
					<Flex align="center" gap={5}>
						<IconCircleFilled size={8} style={{ color: theme.fn.themeColor(difficultyColor['hard']) }} />
						<Text inline color={difficultyColor['hard']}>
							{passCount}
						</Text>
						<Text>hard</Text>
					</Flex>
				</Flex>
			</Group>
		</Flex>
	);
}
