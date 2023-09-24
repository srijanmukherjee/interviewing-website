'use client';

import { Box, Center, Container, Loader, Tabs, Title } from '@mantine/core';
import dynamic from 'next/dynamic';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

import StyledTabs from '@/components/StyledTabs';
import { submissionService } from '@/services';
import { submissionsAtom } from '@/state';

const SubmissionTable = dynamic(() => import('@/components/Submission/SubmissionTable'), {
	loading: () => (
		<Center sx={(theme) => ({ height: '200px', backgroundColor: theme.colors.gray[0] })}>
			<Loader size="sm" variant="bars" />
		</Center>
	),
});

export default function SubmissionsPage() {
	const [submissions] = useAtom(submissionsAtom);
	const submissionsList = useMemo(() => submissionService.unpackSubmissions(submissions), [submissions]);
	const pendingSubmissionsList = useMemo(
		() => submissionsList.filter((submission) => submission.grade === undefined),
		[submissionsList]
	);

	return (
		<Box>
			<Title weight={500} mb="xl">
				Submissions
			</Title>

			<StyledTabs defaultValue="pending">
				<Tabs.List>
					<Tabs.Tab value="pending">Pending</Tabs.Tab>
					<Tabs.Tab value="all">All</Tabs.Tab>
				</Tabs.List>

				<Box mt="xl">
					<Tabs.Panel value="pending">
						<SubmissionTable submissions={pendingSubmissionsList} />
					</Tabs.Panel>
					<Tabs.Panel value="all">
						<SubmissionTable submissions={submissionsList} showStatus />
					</Tabs.Panel>
				</Box>
			</StyledTabs>
		</Box>
	);
}
