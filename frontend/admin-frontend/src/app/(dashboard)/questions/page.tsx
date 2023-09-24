'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { useAtom } from 'jotai';
import { Box, Button, Flex, Group, Stack, Text, Menu, Title, useMantineTheme } from '@mantine/core';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import {
	useMantineReactTable,
	type MRT_ColumnDef,
	MRT_ToolbarAlertBanner,
	MRT_TablePagination,
	MRT_GlobalFilterTextInput,
	MantineReactTable,
} from 'mantine-react-table';
import { deleteQuestion } from '@/controller/deleteQuestion';
import { questionsAtom, submissionsAtom } from '@/state';
import { Question } from '@/model';

export default function Questions() {
	const theme = useMantineTheme();

	const [questions] = useAtom(questionsAtom);
	const [submissions] = useAtom(submissionsAtom);

	const columns = useMemo<MRT_ColumnDef<Question>[]>(
		() => [
			{
				accessorKey: 'title',
				header: 'Title',
				minSize: 350,
				Cell: ({ row }) => {
					return (
						<Box>
							<Link
								href={`/questions/view/${row.original.slug}`}
								style={{ textDecoration: 'none', color: theme.colors.blue[7] }}>
								{row.original.title}
							</Link>
						</Box>
					);
				},
			},
			{
				accessorKey: 'difficulty',
				header: 'Difficulty',
				maxSize: 100,
				Cell: ({ row }) => {
					return (
						<Text
							color={({ easy: 'green', hard: 'red', medium: 'yellow' } as any)[row.original.difficulty]}>
							{row.original.difficulty}
						</Text>
					);
				},
			},
			{
				accessorKey: 'type',
				maxSize: 100,
				header: 'Type',
			},
		],
		[theme]
	);

	const table = useMantineReactTable({
		columns,
		data: questions,
		enableSorting: true,
		initialState: {
			pagination: { pageSize: 5, pageIndex: 0 },
			showGlobalFilter: true,
		},

		mantinePaginationProps: {
			rowsPerPageOptions: ['5', '10', '20', '30'],
		},

		mantineSearchTextInputProps: {
			placeholder: 'Search questions',
		},
		enableBottomToolbar: false,
		enableTopToolbar: false,
		paginationDisplayMode: 'pages',
		enableRowActions: true,
		renderRowActionMenuItems: ({ row }) => (
			<>
				<Menu.Item icon={<IconEdit />} component={Link} href={`/questions/edit/${row.original.slug}`}>
					Edit Question
				</Menu.Item>
				<Menu.Item icon={<IconTrash />} color="red" onClick={() => deleteQuestion(row.original, submissions)}>
					Delete
				</Menu.Item>
			</>
		),
	});

	return (
		<Box>
			<Title weight={500} mb="xl">
				Questions
			</Title>

			<Stack>
				<Flex justify="space-between" align="center">
					<Group>
						<Button leftIcon={<IconPlus size="1.2rem" />} component={Link} href="/questions/create">
							Create
						</Button>
						<MRT_GlobalFilterTextInput table={table} />
					</Group>
					<MRT_TablePagination table={table} />
				</Flex>
				{/* Using Vanilla Mantine Table component here */}
				<MantineReactTable table={table} selectDisplayMode={undefined} />
				<MRT_ToolbarAlertBanner stackAlertBanner table={table} />
			</Stack>
		</Box>
	);
}
