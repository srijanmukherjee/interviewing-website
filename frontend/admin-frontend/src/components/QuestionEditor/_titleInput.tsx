import { Stack, TextInput } from '@mantine/core';
import { QuestionEditorActionKind, useQuestionEditorContext } from './_context';

export default function TitleInput() {
	const { state, dispatch, submitting } = useQuestionEditorContext();

	return (
		<Stack>
			<TextInput
				required
				placeholder="Enter title"
				size="lg"
				autoFocus
				label="Title"
				value={state.title}
				disabled={state.mode === 'edit' || submitting}
				onChange={(ev) =>
					dispatch({ type: QuestionEditorActionKind.SET_TITLE, payload: ev.currentTarget.value })
				}
			/>

			<TextInput
				label="Slug"
				value={state.slug}
				size="md"
				disabled
				error={!state.slugAvailable ? 'Already taken' : null}
			/>
		</Stack>
	);
}
