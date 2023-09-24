import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import { useStyles } from './style';
import { workers } from './workers';
import { Button, Flex, Group, Loader, UnstyledButton, Text } from '@mantine/core';
import EditorToolbar from './EditorToolbar';
import Split from 'react-split';
import { IconChevronUp } from '@tabler/icons-react';
import { DEFAULT_PROGRAMMING_LANGUAGE, MONACO_EDITOR_DEFAULT_OPTIONS } from '@/constants';
import Console from './Console';
import executeCode, { handleExecutionError } from '@/service/execution';
import { NetworkError } from '@/models/error';
import { useQuestion } from '@/context/QuestionContext';

const MonacoEditor = dynamic(() => import('react-monaco-editor'), {
	ssr: false,
	loading: () => (
		<Flex h="100%" align="center" justify="center">
			<Loader size="sm" />
		</Flex>
	),
});

interface Props {
	defaultLanguage?: string;
}

function onMonacoEditorDidMount() {
	// @ts-ignore
	window.MonacoEnvironment.getWorkerUrl = (_moduleId: string, label: string) =>
		workers[label] ?? '/_next/static/editor.worker.js';
}

export default function Editor({ defaultLanguage = DEFAULT_PROGRAMMING_LANGUAGE }: Props) {
	const [compilationOutput, setCompilationOutput] = useState<object | null>(null);
	const [networkError, setNetworkError] = useState<NetworkError | null>(null);
	const [editorDarkTheme, setEditorDarkTheme] = useState<boolean>(true);
	const [consoleActive, setConsoleActive] = useState<boolean>(false);
	const [codeExecuting, setCodeExecuting] = useState<boolean>(false);
	const [commandLineArgs, setCommandLineArgs] = useState<string>('');
	const [language, setLanguage] = useState<string>(defaultLanguage);
	const [editorFontSize, setEditorFontSize] = useState<number>(16);
	const [editorContent, setEditorContent] = useState<string>('');
	const [stdin, setStdin] = useState<string>('');
	const { classes, cx } = useStyles();
	const { question, submitting, onSubmit } = useQuestion();
	const autosaveTimeout = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		if (process.browser) {
			const value = localStorage.getItem('editor-font-size');
			if (value) setEditorFontSize(Number.parseInt(value));

			const content = localStorage.getItem(`editor/content/${question.slug}/${language}`);
			if (content) setEditorContent(atob(content));
		}
	}, [question, language]);

	useEffect(() => {
		if (autosaveTimeout.current) clearTimeout(autosaveTimeout.current);
		autosaveTimeout.current = setTimeout(() => {
			localStorage.setItem(`editor/content/${question.slug}/${language}`, btoa(editorContent));
		}, 2000);
	}, [editorContent, language, autosaveTimeout, question]);

	const setEditorFontSizeCached = (size: number) => {
		if (process.browser) localStorage.setItem('editor-font-size', size.toString());
		setEditorFontSize(size);
	};

	const runCode = () => {
		setCodeExecuting(true);
		setNetworkError(null);
		if (!consoleActive) setConsoleActive(true);

		executeCode(editorContent, language, stdin, commandLineArgs)
			.then((res) => res.data)
			.then(setCompilationOutput)
			.catch((error: Error) => setNetworkError(handleExecutionError(error)))
			.finally(() => {
				setCodeExecuting(false);
			});
	};

	return (
		<Flex direction="column" rowGap={7} className={classes.container}>
			<Split
				sizes={[consoleActive ? 70 : 100, consoleActive ? 30 : 0]}
				minSize={0}
				maxSize={Infinity}
				snapOffset={1}
				direction="vertical"
				className={cx(classes.split, { [classes.consoleActive]: consoleActive === true })}
				gutterSize={consoleActive ? 6 : 0}>
				<div className={classes.splitContainer}>
					<Flex direction="column" className={classes.top}>
						<EditorToolbar
							language={language}
							setLanguage={setLanguage}
							darkTheme={editorDarkTheme}
							toggleTheme={setEditorDarkTheme}
							fontSize={editorFontSize}
							setFontSize={setEditorFontSizeCached}
						/>
						<MonacoEditor
							editorDidMount={onMonacoEditorDidMount}
							language={language}
							theme={editorDarkTheme ? 'vs-dark' : 'vs-light'}
							value={editorContent}
							onChange={setEditorContent}
							options={{
								...MONACO_EDITOR_DEFAULT_OPTIONS,
								fontSize: editorFontSize,
							}}
							className={classes.editor}
						/>
					</Flex>
				</div>
				<Console
					active={consoleActive}
					result={compilationOutput}
					stdin={stdin}
					setStdin={setStdin}
					commandLineArgs={commandLineArgs}
					setCommandLineArgs={setCommandLineArgs}
					executing={codeExecuting}
					networkError={networkError}
				/>
			</Split>

			<Flex className={classes.bottomBar}>
				<Group pl="sm">
					<UnstyledButton className={classes.consoleBtn} onClick={() => setConsoleActive((v) => !v)}>
						<Group spacing={6}>
							<Text size="sm">Console</Text>
							<IconChevronUp
								size={16}
								style={{ transition: '100ms', transform: consoleActive ? 'rotate(180deg)' : undefined }}
							/>
						</Group>
					</UnstyledButton>
				</Group>
				<Group spacing="xs" position="right" style={{ flexGrow: 1 }}>
					<Button
						bg="gray.8"
						size="xs"
						variant="default"
						onClick={runCode}
						disabled={submitting}
						loading={codeExecuting}>
						Run
					</Button>
					<Button
						color="primary"
						sx={(theme) => ({ color: theme.colors.dark[6] })}
						size="xs"
						disabled={codeExecuting || editorContent.trim().length == 0}
						onClick={() => {
							onSubmit({ content: editorContent, language });
						}}
						loading={submitting}>
						Submit
					</Button>
				</Group>
			</Flex>
		</Flex>
	);
}
