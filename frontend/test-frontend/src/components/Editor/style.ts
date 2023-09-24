import { getApplicationColor } from '@/app/theme';
import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
	container: {
		height: '100%',
		width: '100%',
		justifyContent: 'space-between',
	},

	split: {
		width: '100%',
		flexGrow: 0,
		flexBasis: '100%',
		overflow: 'auto',

		'.gutter': {
			display: 'none',
			backgroundRepeat: 'no-repeat',
			backgroundPosition: '50%',
			transition: '200ms',
			borderRadius: theme.radius.sm,

			'&:hover': {
				backgroundColor: theme.colors.primary[7],
			},
		},

		'.gutter.gutter-vertical': {
			backgroundImage:
				"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=')",
			cursor: 'row-resize',
			backgroundSize: 'auto 50%',
		},
	},

	splitContainer: {
		flex: 1,
		height: '100%',
	},

	editor: {},

	toolbar: {
		backgroundColor: getApplicationColor(theme, 'toolbar'),
		justifyContent: 'space-between',

		button: {
			color: theme.colors.gray[6],
			transition: 'color 150ms ease-in',
			alignItems: 'center',
			display: 'flex',

			'&:hover': {
				color: theme.colors.gray[3],
			},
		},
	},

	top: {
		height: '100%',
		width: '100%',
		overflow: 'hidden',
		borderRadius: theme.radius.sm,
	},

	console: {
		borderRadius: theme.radius.sm,
		overflow: 'hidden',
	},

	consoleActive: {
		'.gutter': {
			display: 'block',
		},
	},

	bottomBar: {
		padding: '0.5rem 0.525rem',
		backgroundColor: theme.colors.dark[7],
		borderRadius: theme.radius.sm,
	},

	consoleBtn: {
		color: theme.colors.gray[6],
		transition: 'color 150ms ease-in',

		'&:hover': {
			color: theme.colors.gray[3],
		},
	},
}));
