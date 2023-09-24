import { Button, Group, Title } from '@mantine/core';
import { useQuestionEditorContext } from './_context';
import lang from '@/constants/lang';
import { useEffect, useState } from 'react';

export default function Header() {
	const { state, submitting } = useQuestionEditorContext();
	const [disabled, setDisabled] = useState<boolean>(false);

	useEffect(() => {
		if (state.title.trim().length === 0) return setDisabled(true);
		if (!state.slugAvailable) return setDisabled(true);

		if (state.type === 'coding') {
			if (state.parameters.memoryLimit <= 128000 || state.parameters.memoryLimit.toString() === 'NaN')
				return setDisabled(true);
			if (state.parameters.timeLimit < 1000 || state.parameters.timeLimit.toString() === 'NaN')
				return setDisabled(true);
		}

		if (state.contentLength === 0) return setDisabled(true);

		setDisabled(false);
	}, [state]);

	return (
		<Group align="center" position="apart" mb="1.725rem">
			<Title weight={500}>
				{state.mode === 'create' ? lang.QUESTION_EDITOR_CREATE_TITLE : lang.QUESTION_EDITOR_EDIT_TITLE}
			</Title>

			<Button size="md" type="submit" style={{ transition: '100ms' }} loading={submitting} disabled={disabled}>
				{state.mode === 'create' ? lang.QUESTION_EDITOR_BTN_CREATE : lang.QUESTION_EDITOR_BTN_SAVE}
			</Button>
		</Group>
	);
}
