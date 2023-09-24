import { Group, Text, SegmentedControl } from '@mantine/core';
import { QuestionEditorActionKind, useQuestionEditorContext } from './_context';
import { QuestionDifficulty } from '@/model/question';

export default function DifficultyInput() {
	const { state, dispatch, submitting } = useQuestionEditorContext();

	return (
		<Group>
			<Text size="xl">Difficulty</Text>
			<SegmentedControl
				data={[
					{
						value: QuestionDifficulty.EASY,
						label: 'Easy',
					},
					{
						value: QuestionDifficulty.MEDIUM,
						label: 'Medium',
					},
					{
						value: QuestionDifficulty.HARD,
						label: 'Hard',
					},
				]}
				disabled={submitting}
				value={state.difficulty}
				onChange={(value) => dispatch({ type: QuestionEditorActionKind.SET_DIFFICULTY, payload: value })}
			/>
		</Group>
	);
}
