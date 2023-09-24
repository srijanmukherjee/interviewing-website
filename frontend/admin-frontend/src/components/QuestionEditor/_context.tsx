import { Question } from '@/model';
import { QuestionDifficulty } from '@/model/question';
import { Dispatch, FormEvent, PropsWithChildren, createContext, useContext, useEffect, useReducer } from 'react';
import { createQuestion, createSlug } from './_util';
import { useAtom } from 'jotai';
import { questionsAtom } from '@/state';
import { modals } from '@mantine/modals';
import { Text } from '@mantine/core';
import {
	DEFAULT_DURATION_LIMIT,
	DEFAULT_MEMORY_LIMIT,
	DEFAULT_TIME_LIMIT,
	DEFAULT_WORD_LIMIT as DEFAULT_CHARACTER_LIMIT,
} from '@/constants/model';

interface QuestionEditorContextProviderProps extends PropsWithChildren {
	question?: Question;
	submitting: boolean;
	onSubmit: (question: Question | undefined) => void;
}

// reducer types

interface QuestionEditorState {
	title: string;
	slug: string;
	slugAvailable: boolean;
	difficulty: QuestionDifficulty;
	type: 'video' | 'coding' | 'text';
	content: string;
	contentLength: number;
	parameters: {
		durationLimit: number;
		memoryLimit: number;
		timeLimit: number;
		characterLimit: number;
	};
	mode: 'create' | 'edit';
}

enum QuestionEditorActionKind {
	SET_TITLE = 'SET_TITLE',
	SET_DIFFICULTY = 'SET_DIFFICULTY',
	SET_TYPE = 'SET_TYPE',
	SET_CONTENT = 'SET_CONTENT',
	SET_DURATION_LIMIT = 'SET_DURATION_LIMIT',
	SET_MEMORY_LIMIT = 'SET_MEMORY_LIMIT',
	SET_TIME_LIMIT = 'SET_TIME_LIMIT',
	SET_SLUG_AVAILABILITY = 'SET_SLUG_AVAILABILITY',
	SET_CONTENT_LENGTH = 'SET_CONTENT_LENGTH',
	SET_CHARACTER_LIMIT = 'SET_WORD_LIMIT',
}

interface QuestionEditorAction {
	type: QuestionEditorActionKind;
	payload: any;
}

// context types

interface QuestionEditorContextType {
	state: QuestionEditorState;
	dispatch: Dispatch<QuestionEditorAction>;
	submitting: boolean;
}

const QuestionEditorContext = createContext<QuestionEditorContextType | undefined>(undefined);

function useQuestionEditorContext() {
	const context = useContext(QuestionEditorContext);

	if (context === undefined) {
		throw new Error('You are using QuestionEditorContext outside the provider');
	}

	return context;
}

// reducer

function reducer(state: QuestionEditorState, action: QuestionEditorAction): QuestionEditorState {
	switch (action.type) {
		case QuestionEditorActionKind.SET_TITLE:
			return { ...state, title: action.payload, slug: createSlug(action.payload.trim()) };
		case QuestionEditorActionKind.SET_CONTENT:
			return { ...state, content: action.payload };
		case QuestionEditorActionKind.SET_TYPE:
			return { ...state, type: action.payload as 'video' | 'coding' | 'text' };
		case QuestionEditorActionKind.SET_DIFFICULTY:
			return { ...state, difficulty: action.payload as QuestionDifficulty };
		case QuestionEditorActionKind.SET_DURATION_LIMIT:
			return {
				...state,
				parameters: {
					...state.parameters,
					durationLimit: Number.isNaN(parseFloat(action.payload)) ? 5 : parseFloat(action.payload),
				},
			};
		case QuestionEditorActionKind.SET_TIME_LIMIT:
			return {
				...state,
				parameters: {
					...state.parameters,
					timeLimit: Number.isNaN(parseInt(action.payload)) ? 1000 : parseInt(action.payload),
				},
			};
		case QuestionEditorActionKind.SET_MEMORY_LIMIT:
			return {
				...state,
				parameters: {
					...state.parameters,
					memoryLimit: Number.isNaN(parseInt(action.payload)) ? 64000 : parseInt(action.payload),
				},
			};
		case QuestionEditorActionKind.SET_SLUG_AVAILABILITY:
			return { ...state, slugAvailable: !!action.payload };
		case QuestionEditorActionKind.SET_CONTENT_LENGTH:
			return { ...state, contentLength: parseInt(action.payload) };
		case QuestionEditorActionKind.SET_CHARACTER_LIMIT:
			return { ...state, parameters: { ...state.parameters, characterLimit: parseInt(action.payload) } };
	}
}

const initialState: QuestionEditorState = {
	title: '',
	slug: '',
	slugAvailable: true,
	content: '',
	contentLength: 0,
	type: 'coding',
	difficulty: QuestionDifficulty.EASY,
	parameters: {
		durationLimit: DEFAULT_DURATION_LIMIT,
		memoryLimit: DEFAULT_MEMORY_LIMIT,
		timeLimit: DEFAULT_TIME_LIMIT,
		characterLimit: DEFAULT_CHARACTER_LIMIT,
	},
	mode: 'create',
};

function QuestionEditorContextProvider({
	children,
	question,
	submitting,
	onSubmit,
}: QuestionEditorContextProviderProps) {
	const [state, dispatch] = useReducer(
		reducer,
		question === undefined
			? initialState
			: {
					...initialState,
					title: question.title,
					content: question.question,
					difficulty: question.difficulty,
					type: question.type,
					parameters: {
						durationLimit:
							question.type === 'video' ? question.parameters.durationLimit : DEFAULT_DURATION_LIMIT,
						memoryLimit:
							question.type === 'coding' ? question.parameters.memoryLimit : DEFAULT_MEMORY_LIMIT,
						timeLimit: question.type === 'coding' ? question.parameters.timeLimit : DEFAULT_TIME_LIMIT,
						characterLimit:
							question.type === 'text' ? question.parameters.characterLimit : DEFAULT_CHARACTER_LIMIT,
					},
					mode: 'edit',
					slug: createSlug(question.title),
					contentLength: question.question.length,
			  }
	);

	const [questions] = useAtom(questionsAtom);

	useEffect(() => {
		if (questions.length === 0 || state.mode === 'edit') return;
		const idx = questions.findIndex((question) => question.slug === state.slug);
		dispatch({ type: QuestionEditorActionKind.SET_SLUG_AVAILABILITY, payload: idx === -1 });
	}, [state.slug, state.mode, questions]);

	const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		modals.openConfirmModal({
			title: 'Please confirm your action',
			children: (
				<Text size="sm">
					{state.mode === 'edit' ? 'Save your changes?' : 'The question is about to go live'}
				</Text>
			),
			labels: { confirm: 'Confirm', cancel: 'Cancel' },
			onConfirm: () => onSubmit(createQuestion(state)),
		});
	};

	return (
		<form onSubmit={handleSubmit}>
			<QuestionEditorContext.Provider value={{ state, dispatch, submitting }}>
				{children}
			</QuestionEditorContext.Provider>
		</form>
	);
}

export { QuestionEditorContextProvider, useQuestionEditorContext, QuestionEditorActionKind, type QuestionEditorState };
