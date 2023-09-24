import { editor } from 'monaco-editor';

export const DEFAULT_PROGRAMMING_LANGUAGE = 'swift';
export const MONACO_EDITOR_DEFAULT_OPTIONS: editor.IStandaloneEditorConstructionOptions = {
	minimap: {
		enabled: false,
	},
	automaticLayout: true,
};
export const DEFAULT_VIDEO_DURATION_LIMIT = 120;

// match the strings with what you set in the db
export enum QUESTION_TYPE {
	CODING = 'coding',
	VIDEO = 'video',
	TEXT = 'text',
}
