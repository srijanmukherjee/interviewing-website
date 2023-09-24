import { Group, Badge } from '@mantine/core';
import dayjs from 'dayjs';
import { ReactNode } from 'react';

interface Props {
	children?: ReactNode;
	submission?: {
		createdAt: number;
	};
}

export default function Metainformation({ children, submission }: Props) {
	if (!submission) return;

	return (
		<Group spacing="xs" my={5}>
			<Badge size="lg" my={10}>
				Submitted on {dayjs(submission.createdAt).format('DD/MM/YYYY HH:mm:ss')}
			</Badge>
			{children}
		</Group>
	);
}
