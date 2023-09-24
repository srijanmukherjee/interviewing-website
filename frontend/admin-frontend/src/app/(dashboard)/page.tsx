'use client';

import QuestionsCard from '@/components/Dashboard/QuestionsCard';
import SubmissionsCard from '@/components/Dashboard/SubmissionsCard';
import { Box, Flex, Title } from '@mantine/core';
import dynamic from 'next/dynamic';

const ExecutionStatistics = dynamic(() => import('@/components/Dashboard/ExecutionStatistics'));

export default function Home() {
	return (
		<>
			<Title weight={500}>Dashboard</Title>

			<Flex gap="10px" wrap="wrap" justify="flex-start" mt="md">
				<Box w={{ md: '220px', base: '100%' }}>
					<QuestionsCard />
				</Box>
				<Box w={{ md: '220px', base: '100%' }}>
					<SubmissionsCard />
				</Box>
			</Flex>

			<ExecutionStatistics />
		</>
	);
}
