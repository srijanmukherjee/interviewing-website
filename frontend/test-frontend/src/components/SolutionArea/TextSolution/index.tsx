import { Badge, Box, Button, Flex, Group, Text, Tooltip, UnstyledButton } from '@mantine/core';
import { useStyles } from './style';
import { useQuestion } from '@/context/QuestionContext';
import { IconMinus, IconPlus } from '@tabler/icons-react';
import { useState } from 'react';
import { RichTextEditor } from '@mantine/tiptap';
import StarterKit from '@tiptap/starter-kit';
import CharacterCount from '@tiptap/extension-character-count';
import Placeholder from '@tiptap/extension-placeholder';
import { useEditor } from '@tiptap/react';

export default function TextSolution() {
	const { classes } = useStyles();
	const { question, submitting, onSubmit } = useQuestion();
	const [content, setContent] = useState<string>('');
	const [fontSize, setFontSize] = useState<number>(16);
	const [characterCount, setCharacterCount] = useState<number>(0);
	const characterLimit = question.parameters.characterLimit ?? 180;

	const editor = useEditor({
		extensions: [
			StarterKit,
			Placeholder.configure({
				placeholder: () => {
					return 'You can write your answer here.';
				},
			}),
			CharacterCount.configure({
				limit: characterLimit,
			}),
		],
		autofocus: true,
		content: content,
		onUpdate: ({ editor }) => {
			setCharacterCount(editor.getText().length);
			setContent(editor.getHTML());
		},
	});

	return (
		<>
			<Flex direction="column" rowGap={7} className={classes.container}>
				<Flex h="100%" direction="column" style={{ overflow: 'auto' }}>
					{/* Toolbar */}
					<Flex className={classes.toolbar}>
						<Group pl="sm">
							<Text sx={(theme) => ({ color: theme.colors.gray[6] })} size="sm">
								Limit: {characterCount} / {characterLimit} characters
							</Text>
						</Group>

						<Group align="center">
							<UnstyledButton onClick={() => setFontSize(Math.max(14, fontSize - 1))}>
								<IconMinus size={16} />
							</UnstyledButton>

							<Badge>{fontSize}px</Badge>

							<UnstyledButton onClick={() => setFontSize(Math.min(24, fontSize + 1))}>
								<IconPlus size={16} />
							</UnstyledButton>
						</Group>
					</Flex>
					<Flex
						p={10}
						align="center"
						justify="center"
						sx={(theme) => ({
							backgroundColor: theme.colors.dark[7],
							overflow: 'auto',
							flexGrow: 0,
							flexBasis: '100%',
						})}>
						<Box style={{ flex: 1, height: '100%', overflow: 'auto' }}>
							<RichTextEditor editor={editor} style={{ height: '100%', border: 'none' }}>
								<RichTextEditor.Toolbar sticky style={{ border: 'none' }}>
									<RichTextEditor.ControlsGroup>
										<RichTextEditor.Bold />
										<RichTextEditor.Italic />
										<RichTextEditor.Underline />
										<RichTextEditor.Strikethrough />
										<RichTextEditor.ClearFormatting />
										<RichTextEditor.Highlight />
										<RichTextEditor.Code />
									</RichTextEditor.ControlsGroup>
									<RichTextEditor.ControlsGroup>
										<RichTextEditor.H1 />
										<RichTextEditor.H2 />
										<RichTextEditor.H3 />
										<RichTextEditor.H4 />
									</RichTextEditor.ControlsGroup>
								</RichTextEditor.Toolbar>
								<RichTextEditor.Content
									placeholder="Enter your answer here."
									style={{ fontSize: fontSize }}
								/>
							</RichTextEditor>
						</Box>
					</Flex>
				</Flex>
				<Flex className={classes.bottomBar} justify="end">
					<Tooltip label={'Submit response'}>
						<Button
							color="primary"
							sx={{ color: 'black' }}
							size="xs"
							loading={submitting}
							onClick={() => {
								onSubmit({ content });
							}}
							disabled={characterCount == 0}>
							Submit
						</Button>
					</Tooltip>
				</Flex>
			</Flex>
		</>
	);
}
