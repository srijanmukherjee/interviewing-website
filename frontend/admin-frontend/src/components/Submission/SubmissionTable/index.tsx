import { Submission } from '@/model';
import { questionsAtom, usersAtom } from '@/state';
import { Flex, Anchor, Badge, Group, Text, Box, MediaQuery } from '@mantine/core';
import { IconCode, IconTextCaption, IconVideo } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import {
	MRT_ColumnDef,
	MRT_GlobalFilterTextInput,
	MRT_TablePagination,
	MantineReactTable,
	useMantineReactTable,
} from 'mantine-react-table';
import Link from 'next/link';
import { useMemo } from 'react';

interface Props {
	submissions: Submission[];
	showStatus?: boolean;
	showQuestion?: boolean;
}

export default function SubmissionTable({ submissions, showStatus = false, showQuestion = true }: Props) {
	const [users] = useAtom(usersAtom);
	const [questions] = useAtom(questionsAtom);

	const columns = useMemo<MRT_ColumnDef<Submission>[]>(() => {
		let cols: MRT_ColumnDef<Submission>[] = [
			{
				accessorFn: ({ uid }) => (users[uid] ? `${users[uid].firstName} ${users[uid].secondName}` : 'Unknown'),
				header: 'User',
				Cell: ({ renderedCellValue, row }) => {
					const mode = row.original.grade === undefined ? 'check' : 'view';
					return showQuestion ? (
						renderedCellValue
					) : (
						<Anchor href={`/submissions/${mode}/${row.original.uid}/${row.original.slug}`} component={Link}>
							{renderedCellValue}
						</Anchor>
					);
				},
			},
		];

		if (showQuestion)
			cols.push({
				accessorFn: ({ slug }) => {
					const question = questions.find((question) => question.slug === slug);
					if (!question) return null;
					return question.title;
				},
				header: 'Question',
				size: 280,
				Cell: ({
					row: {
						original: { uid, slug, grade },
					},
				}) => {
					const question = questions.find((question) => question.slug === slug);
					if (!question) {
						return <Text color="red">Deleted</Text>;
					}

					const mode = grade ? 'view' : 'check';

					return (
						<Anchor component={Link} href={`/submissions/${mode}/${uid}/${question.slug}`}>
							{question.title}
						</Anchor>
					);
				},
			});

		cols = [
			...cols,
			{
				id: 'submissionDate',
				accessorFn: ({ createdAt }) => {
					return dayjs(createdAt).toString();
				},
				size: 250,
				header: 'Submission date',
				sortingFn: (recordA, recordB) => {
					return recordA.original.createdAt - recordB.original.createdAt;
				},
			},
			{
				accessorFn: (submission) => {
					const question = questions.find((question) => question.slug === submission.slug);
					if (!question) {
						return <Text color="red">Deleted</Text>;
					}
					return question.type;
				},
				Cell: ({ row }) => {
					const question = questions.find((question) => question.slug === row.original.slug);
					if (!question) {
						return <Text color="red">Deleted</Text>;
					}
					return (
						<Badge>
							<Group spacing={5}>
								{question.type === 'coding' ? (
									<IconCode size={16} />
								) : question.type === 'video' ? (
									<IconVideo size={16} />
								) : (
									<IconTextCaption size={16} />
								)}
								<Text>{question.type}</Text>
							</Group>
						</Badge>
					);
				},
				header: 'Type',
			},
		];

		if (showStatus) {
			cols.push({
				id: 'status',
				accessorFn: ({ grade }) => {
					return grade ? grade : 'pending';
				},
				header: 'Status',
				Cell: ({
					row: {
						original: { grade },
					},
					renderedCellValue,
				}) => {
					return (
						<Text tt="uppercase" color={grade ? (grade === 'pass' ? 'green' : 'red') : 'gray'}>
							{renderedCellValue}
						</Text>
					);
				},
			});
		}

		return cols;
	}, [questions, users, showStatus, showQuestion]);

	const table = useMantineReactTable({
		columns,
		data: submissions,
		enableSorting: true,
		initialState: {
			pagination: { pageSize: 5, pageIndex: 0 },
			showGlobalFilter: true,
			sorting: [
				{
					id: 'submissionDate',
					desc: true,
				},
			],
		},

		mantineSearchTextInputProps: {
			placeholder: 'Search submissions',
			style: {
				width: '100%',
			},
		},

		enableBottomToolbar: true,
		enableTopToolbar: true,
		paginationDisplayMode: 'pages',
		renderTopToolbar: ({ table }) => {
			return (
				<Flex justify="space-between" align="center" wrap="wrap" p="md" rowGap={20}>
					<Box
						sx={(theme) => ({
							width: '200px',
							[theme.fn.smallerThan('md')]: {
								width: '100%',
							},
						})}>
						<MRT_GlobalFilterTextInput table={table} />
					</Box>
					<MediaQuery smallerThan="md" styles={{ display: 'none' }}>
						<Box>
							<MRT_TablePagination table={table} />
						</Box>
					</MediaQuery>
				</Flex>
			);
		},

		renderBottomToolbar: ({ table }) => {
			return (
				<MediaQuery largerThan="md" styles={{ display: 'none' }}>
					<Box
						sx={(theme) => ({
							'.mantine-InputWrapper-root': {
								input: {
									width: '100px',
								},
							},
						})}>
						<MRT_TablePagination table={table} />
					</Box>
				</MediaQuery>
			);
		},
	});
	return (
		<Box sx={(theme) => ({})}>
			<MantineReactTable table={table} />
		</Box>
	);
}
