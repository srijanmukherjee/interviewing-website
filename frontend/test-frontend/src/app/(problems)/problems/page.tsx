'use client';

import { Container, Loader } from '@mantine/core';
import { IconChevronDown, IconChevronUp } from '@tabler/icons-react';
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import { useEffect, useState } from 'react';

import { sortBy } from 'lodash';
import { useAtom } from 'jotai';
import { submissionsAtom } from '@/state/submissions';
import { useStyles } from './style';
import { compareDifficulty, renderColumn } from './util';
import { Question } from '@/models';
import { questionsAtom, questionsLoadedAtom } from '@/state/question';
import { mergeQuestionsAndSubmissions } from '@/util/data';
import ProblemsStatus from '@/components/ProblemsStatus';

const columns = [
	{ accessor: 'status', width: 80 },
	{ accessor: 'title', sortable: true, noWrap: true },
	{ accessor: 'difficulty', sortable: true },
	{ accessor: 'type', sortable: true },
];

/**
 * Problem listing page
 * lists all the problems and user stats
 */
export default function ProblemsPage() {
	const { classes } = useStyles();
	const [records, setRecords] = useState<Question[]>([]);
	const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({ columnAccessor: 'title', direction: 'asc' });
	const [questions] = useAtom(questionsAtom);
	const [submissions]: any = useAtom(submissionsAtom);
	const [questionsLoaded] = useAtom(questionsLoadedAtom);

	useEffect(() => {
		let data;
		if (sortStatus.columnAccessor === 'difficulty') {
			data = questions.sort((a, b) => {
				return compareDifficulty(a.difficulty, b.difficulty);
			});
		} else {
			data = sortBy(questions, sortStatus.columnAccessor);
		}
		setRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
	}, [sortStatus, questions]);

	return (
		<Container size="lg">
			<ProblemsStatus />
			<DataTable
				className={classes.table}
				noRecordsText="No questions to show"
				minHeight={150}
				records={mergeQuestionsAndSubmissions(records, submissions)}
				columns={columns}
				idAccessor="slug"
				textSelectionDisabled
				fetching={!questionsLoaded}
				loaderBackgroundBlur={2}
				customLoader={<Loader size="sm" />}
				sortStatus={sortStatus}
				defaultColumnRender={renderColumn}
				onSortStatusChange={setSortStatus}
				sortIcons={{
					sorted: <IconChevronUp size={14} />,
					unsorted: <IconChevronDown size={14} />,
				}}
				mb={20}
			/>
		</Container>
	);
}
