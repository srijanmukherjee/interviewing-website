import { Box, Text, Flex, Loader, Paper, useMantineTheme, PaperProps, Alert } from '@mantine/core';
import { useEffect, useRef, useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { IconAlertCircle } from '@tabler/icons-react';
import dayjs from 'dayjs';
import auth from '@/services/auth';

const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

function getDateLabels(dates: string[]) {
	const _dates = dates.map((date) => new Date(date));
	const labels: string[] = [];
	let last_month = _dates[0].getMonth();
	let last_year = _dates[0].getFullYear();

	for (let i = _dates.length - 1; i >= 0; i--) {
		const month = _dates[i].getMonth();
		const year = _dates[i].getFullYear();

		if (year != last_year) {
			labels.push(`${year}-${monthNames[month]}-${_dates[i].getDate()}`);
		} else if (month != last_month) {
			labels.push(`${_dates[i].getDate()}-${monthNames[month].substring(0, 3)}`);
		} else {
			labels.push(`${_dates[i].getDate()}`);
		}

		last_month = month;
		last_year = year;
	}

	return labels;
}

function HitsPerDay({ data }: { data: any }) {
	const theme = useMantineTheme();
	const instance = useRef<any>(null);
	const days = Object.keys(data.last_30_days);

	useEffect(() => {
		const handler = () => instance.current?.resize();
		window.addEventListener('resize', handler);
		return () => {
			window.removeEventListener('resize', handler);
		};
	}, [instance]);

	return (
		<ReactECharts
			option={{
				title: {
					text: 'Hits / day',
				},
				tooltip: {
					trigger: 'item',
					formatter: function (params: any) {
						const colorSpan = (color: any) =>
							'<span style="display:inline-block;margin-right:5px;border-radius:10px;width:9px;height:9px;background-color:' +
							color +
							'"></span>';

						return `${params.seriesName}<br />
							  ${colorSpan(params.color)} ${dayjs(days[days.length - 1 - params.dataIndex]).format('YYYY-MMM-DD')}: <b>${
							params.data
						}</b>`;
					},
				},
				legend: {
					orient: 'vertical',
					right: 10,
					top: 'center',
					selectedMode: false,
				},
				xAxis: {
					name: 'Days',
					nameGap: 40,
					nameLocation: 'middle',
					data: getDateLabels(days),
				},
				yAxis: {
					name: 'Hits',
					nameLocation: 'middle',
					nameGap: 40,
				},
				series: [
					{
						name: 'Hits',
						type: 'line',
						data: Object.values(data.last_30_days).toReversed(),
						color: theme.colors.red[7],
						smooth: true,
					},
				],
			}}
			style={{ width: '100%', minHeight: '320px' }}
			ref={instance}
		/>
	);
}

function LanguageStats({ data }: any) {
	const theme = useMantineTheme();
	const instance = useRef<any>(null);

	useEffect(() => {
		const handler = () => instance.current?.resize();
		window.addEventListener('resize', handler);
		return () => {
			window.removeEventListener('resize', handler);
		};
	}, [instance]);

	return (
		<ReactECharts
			option={{
				title: {
					text: 'Hits / language',
				},
				tooltip: {},
				legend: {
					orient: 'vertical',
					right: 10,
					top: 'center',
					selectedMode: false,
				},
				xAxis: {
					name: 'Language',
					nameGap: 40,
					nameLocation: 'middle',
					data: data.languages
						.map(({ language }: any) => language.name)
						.map((name: any) => name.substring(0, name.indexOf('('))),
				},
				yAxis: {
					name: 'Hits',
					nameLocation: 'middle',
					nameGap: 40,
				},
				series: [
					{
						name: 'Hits',
						type: 'bar',
						data: data.languages.map((language: any) => language.count),
						color: theme.colors.red[7],
						smooth: true,
					},
				],
			}}
			style={{ width: '100%', minHeight: '320px' }}
			ref={instance}
		/>
	);
}

export default function ExecutionStatistics() {
	const [data, setData] = useState<{
		submissions: { last_30_days: { [key: string]: number } };
		languages: { language: { name: string }; count: number }[];
	}>();
	const [loading, setLoading] = useState<boolean>(true);
	const [success, setSuccess] = useState<boolean>(true);
	const props: PaperProps = {
		shadow: 'xl',
		withBorder: true,
		p: 'sm',
		w: {
			xl: '500px',
			base: '100%',
		},
	};

	useEffect(() => {
		auth.currentUser
			?.getIdToken()
			.then((token) => {
				fetch(`${process.env.NEXT_PUBLIC_API_URL}/statistics/judge0`, {
					headers: {
						Authorization: `Bearer ${token}`,
					},
				})
					.then((res) => {
						if (!res.ok) {
							throw new Error('Something went wrong');
						}
						return res.json();
					})
					.then((res) => setData(res))
					.catch(() => setSuccess(false))
					.finally(() => setLoading(false));
			})
			.catch(() => {
				setSuccess(false);
				setLoading(false);
			});
	}, []);

	if (loading)
		return (
			<Box
				my="xl"
				sx={(theme) => ({
					borderRadius: theme.radius.md,
					padding: theme.spacing.lg,
					backgroundColor: theme.colors.blue[0],
					display: 'grid',
					placeItems: 'center',
				})}>
				<Loader variant="bars" size="sm" />
			</Box>
		);

	return (
		<Box my="xl">
			<Text size={24} mb="xl">
				Judge0 Status
			</Text>
			{success ? (
				<Flex gap="xl" wrap="wrap">
					<Paper {...props}>
						<HitsPerDay data={data?.submissions} />
					</Paper>
					<Paper {...props}>
						<LanguageStats data={data} />
					</Paper>
				</Flex>
			) : (
				<Alert color="red" my="xl" icon={<IconAlertCircle size="1rem" />}>
					Judge0 server is down
				</Alert>
			)}
		</Box>
	);
}
