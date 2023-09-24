import { Paper, Tabs, Box, Textarea, TextInput, Center, Text, Skeleton, Code, Badge } from '@mantine/core';
import { useStyles } from './style';
import { NetworkError } from '@/models/error';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';

interface Props {
	active: boolean;
	result: any;
	stdin: string;
	setStdin: (value: string) => void;
	commandLineArgs: string;
	setCommandLineArgs: (value: string) => void;
	executing: boolean;
	networkError: NetworkError | null;
}

function getNetworkErrorMessage(error: NetworkError | null) {
	if (!error) return null;

	if (error.context?.code === AxiosError.ERR_NETWORK) {
		return 'Could not reach out to the code execution api';
	}

	if (error.context?.response?.data?.message) {
		return error.context?.response.data?.message;
	}

	return 'Something went wrong';
}

function ConsoleResult({
	executing,
	result,
	stdin,
	commandLineArguments,
	networkError,
}: {
	executing: boolean;
	result: any;
	stdin: string;
	commandLineArguments: string;
	networkError: NetworkError | null;
}) {
	if (executing) {
		return (
			<>
				<Skeleton width="50%" height="2em" mb={20} />
				<Skeleton width="30%" height="1em" mb={5} />
				<Skeleton width="60%" height="1em" mb={5} />
				<Skeleton width="56%" height="1em" mb={20} />
			</>
		);
	}

	if (networkError) {
		const message = getNetworkErrorMessage(networkError);

		return (
			<Box>
				<Text size="lg" color="red" style={{ display: 'flex', alignItems: 'center' }} mb={10}>
					Network error
					{networkError.statusCode >= 0 && (
						<Badge color="red" ml={5}>
							{networkError.statusCode}
						</Badge>
					)}
				</Text>

				<Code block color="red" style={{ whiteSpace: 'pre-wrap' }}>
					{networkError.reason}
					{message && (
						<>
							<br />
							{message}
						</>
					)}
				</Code>
			</Box>
		);
	}

	if (!result) {
		return (
			<Center h={'100%'} mx="auto">
				<Text color="gray">You must run your code first</Text>
			</Center>
		);
	}

	if (result.compile_output) {
		return (
			<Box>
				<Text color="red" size="lg">
					Compilation Error
				</Text>
				<Code block color="red">
					{atob(result.compile_output)}
				</Code>
			</Box>
		);
	}

	return (
		<>
			<Box mb={10}>
				<Text>Stdin</Text>
				<Code block>{stdin.length === 0 ? '(empty)' : stdin}</Code>
			</Box>

			<Box mb={10}>
				<Text>Command line arguments</Text>
				<Code block>{commandLineArguments.length === 0 ? '(empty)' : commandLineArguments}</Code>
			</Box>

			<Box>
				<Text>Stdout</Text>
				<Code block>{result.stdout ? atob(result.stdout) : '(empty)'}</Code>
			</Box>

			{result.stderr && (
				<Box mt={10}>
					<Text>Stderr</Text>
					<Code block color="red" style={{ whiteSpace: 'pre-wrap' }}>
						{atob(result.stderr)}
					</Code>
				</Box>
			)}
		</>
	);
}

export default function Console({
	active,
	result,
	setStdin,
	stdin,
	commandLineArgs,
	setCommandLineArgs,
	executing = false,
	networkError,
}: Props) {
	const { classes, cx } = useStyles();
	const [currentTab, setCurrentTab] = useState<string | null>('input');
	const [submittedStdin, setSubmittedStdin] = useState<string>('');
	const [submittedCliArgs, setSubmittedCliArgs] = useState<string>('');

	useEffect(() => {
		if (executing && currentTab !== 'result') setCurrentTab('result');

		if (executing) {
			setSubmittedCliArgs(commandLineArgs);
			setSubmittedStdin(stdin);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [executing, stdin, commandLineArgs]);

	return (
		<div className={cx(classes.splitContainer, classes.console)} style={{ display: active ? 'block' : 'none' }}>
			<Paper style={{ height: '100%' }}>
				<Tabs
					value={currentTab}
					onTabChange={setCurrentTab}
					style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
					{/* Tab buttons */}
					<Tabs.List sx={(theme) => ({ backgroundColor: theme.colors.dark[6] })}>
						<Tabs.Tab value="input">Input</Tabs.Tab>
						<Tabs.Tab value="result">Result</Tabs.Tab>
					</Tabs.List>

					{/* Tab panels */}
					<Box p="sm" style={{ flexGrow: 1, overflow: 'auto' }}>
						<Tabs.Panel value="input">
							<Textarea
								label="STDIN"
								mb={10}
								value={stdin}
								disabled={executing}
								onChange={(ev) => setStdin(ev.currentTarget.value)}
							/>
							<TextInput
								label="Command line arguments"
								value={commandLineArgs}
								disabled={executing}
								onChange={(ev) => setCommandLineArgs(ev.currentTarget.value)}
							/>
						</Tabs.Panel>
						<Tabs.Panel value="result" h={result === null ? '100%' : undefined}>
							<ConsoleResult
								result={result}
								executing={executing}
								stdin={submittedStdin}
								commandLineArguments={submittedCliArgs}
								networkError={networkError}
							/>
						</Tabs.Panel>
					</Box>
				</Tabs>
			</Paper>
		</div>
	);
}
