import { Question } from '@/model';
import { useEditor } from '@tiptap/react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import Highlight from '@tiptap/extension-highlight';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import StarterKit from '@tiptap/starter-kit';
import { lowlight } from 'lowlight';
import { Link, RichTextEditor } from '@mantine/tiptap';
import { useEffect } from 'react';

interface Props {
	question: Question;
}

export default function QuestionViewer({ question }: Props) {
	const editor = useEditor({
		extensions: [
			StarterKit,
			Underline,
			Link,
			Superscript,
			SubScript,
			Highlight,
			TextAlign.configure({ types: ['heading', 'paragraph'] }),
			CodeBlockLowlight.configure({
				lowlight,
			}),
		],
		editable: false,
	});

	useEffect(() => {
		if (question && editor) {
			editor.commands.setContent(question.question);
		}
	}, [question, editor]);

	return (
		<RichTextEditor editor={editor}>
			<RichTextEditor.Content />
		</RichTextEditor>
	);
}
