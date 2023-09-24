import links from '@/app/links';
import { Flex, Tooltip, Text, Badge, Group } from '@mantine/core';
import Link from 'next/link';
import { IconCircleFilled, IconCode, IconTextCaption, IconVideo } from '@tabler/icons-react';
import { Question } from '@/models';
import { SubmissionStatus } from '@/models/submission';

const submissionColor: any = {
	submitted: 'white',
	pass: 'lightgreen',
	fail: 'red',
};

export const difficultyColor: { easy: string; medium: string; hard: string } = {
	easy: 'green.5',
	medium: 'secondary.6',
	hard: 'red.5',
};

export function renderColumn(record: Question, index: number, accesor: string) {
	switch (accesor) {
		case 'status':
			if (record['status'] === undefined || record['status'] === SubmissionStatus.UNATTEMPTED) return null;
			return (
				<Flex align="center" justify="flex-start">
					<Tooltip label={record['status']}>
						<IconCircleFilled size={10} style={{ color: submissionColor[record['status']] ?? 'white' }} />
					</Tooltip>
				</Flex>
			);

		case 'difficulty':
			const color = difficultyColor[record['difficulty']] ?? 'white';

			return (
				<Text color={color} key={record['slug']}>
					{record['difficulty']}
				</Text>
			);

		case 'title':
			return <Link href={`${links.problems}/${record['slug']}`}>{record['title']}</Link>;

		case 'type': {
			return (
				<Badge color="dark">
					<Group spacing={5} noWrap>
						{record['type'] === 'coding' ? (
							<IconCode size={16} />
						) : record['type'] === 'video' ? (
							<IconVideo size={16} />
						) : (
							<IconTextCaption size={16} />
						)}
						<Text>{record['type']}</Text>
					</Group>
				</Badge>
			);
		}

		default:
			return null;
	}
}

const difficulties = ['easy', 'medium', 'hard'];
export function compareDifficulty(a: string, b: string) {
	const i = difficulties.indexOf(a);
	const j = difficulties.indexOf(b);
	return i - j;
}
