import {
	Box,
	Center,
	Group,
	NumberInput,
	SegmentedControl,
	Slider,
	Stack,
	Tabs,
	Text,
	Title,
	Tooltip,
} from '@mantine/core';
import { QuestionEditorActionKind, useQuestionEditorContext } from './_context';
import { IconCode, IconVideo, IconTextCaption } from '@tabler/icons-react';

export default function TypeInput() {
	const { state, dispatch, submitting } = useQuestionEditorContext();

	return (
		<Stack>
			<Text size="xl" weight={500} mt="xl">
				Select question type
			</Text>
			<SegmentedControl
				size="md"
				aria-label="question type"
				data={[
					{
						value: 'coding',
						label: (
							<Center>
								<IconCode size="1.2rem" />
								<Box ml={10}>Code</Box>
							</Center>
						),
					},
					{
						value: 'video',
						label: (
							<Center>
								<IconVideo size="1.2rem" />
								<Box ml={10}>Video</Box>
							</Center>
						),
					},
					{
						value: 'text',
						label: (
							<Center>
								<IconTextCaption size="1.2rem" />
								<Box ml={10}>Text</Box>
							</Center>
						),
					},
				]}
				color={state.mode === 'edit' || submitting ? undefined : 'blue.4'}
				disabled={state.mode === 'edit' || submitting}
				value={state.type}
				onChange={(value) => dispatch({ type: QuestionEditorActionKind.SET_TYPE, payload: value })}
			/>

			<Tabs value={state.type}>
				<Tabs.Panel value="coding">
					<Stack my="xl">
						<Text size="xl">Coding question parameters</Text>
						<NumberInput
							label="Memory Limit (KB)"
							size="md"
							value={state.parameters.memoryLimit}
							onChange={(value) =>
								dispatch({
									type: QuestionEditorActionKind.SET_MEMORY_LIMIT,
									payload: value,
								})
							}
							min={64000}
							disabled={submitting}
						/>
						<NumberInput
							label="Time Limit (ms)"
							size="md"
							value={state.parameters.timeLimit}
							onChange={(value) =>
								dispatch({
									type: QuestionEditorActionKind.SET_TIME_LIMIT,
									payload: value,
								})
							}
							min={1000}
							disabled={submitting}
						/>
					</Stack>
				</Tabs.Panel>
				<Tabs.Panel value="video">
					<Stack my="xl">
						<Text size="xl">Video question parameters</Text>

						<Group align="center" position="left" spacing="lg" pr="2rem">
							<Tooltip label="Maximum recording duration">
								<Text>Duration limit</Text>
							</Tooltip>
							<Slider
								sx={(theme) => ({ flex: 1, width: '100%' })}
								defaultValue={50}
								label={(value) => value / 10 + ' minutes'}
								marks={[
									{ value: 20, label: '2min' },
									{ value: 50, label: '5min' },
									{ value: 80, label: '8min' },
								]}
								min={10}
								value={state.parameters.durationLimit * 10}
								onChange={(value) =>
									dispatch({ type: QuestionEditorActionKind.SET_DURATION_LIMIT, payload: value / 10 })
								}
								disabled={submitting}
							/>
						</Group>
					</Stack>
				</Tabs.Panel>
				<Tabs.Panel value="text">
					<Stack>
						<Text size="xl">Text question parameters</Text>
						<NumberInput
							label="Character limit"
							description="min. 180 characters"
							size="md"
							value={state.parameters.characterLimit}
							onChange={(value) =>
								dispatch({
									type: QuestionEditorActionKind.SET_CHARACTER_LIMIT,
									payload: value,
								})
							}
							min={180}
							disabled={submitting}
						/>
					</Stack>
				</Tabs.Panel>
			</Tabs>
		</Stack>
	);
}
