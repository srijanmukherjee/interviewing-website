import { getApplicationColor } from '@/app/theme';
import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
	container: {
		height: '100%',
		width: '100%',
		justifyContent: 'space-between',
	},

	settingsModal: {
		'.mantine-Modal-header': {
			zIndex: 'initial',
		},

		'.mantine-Modal-content': {
			overflowY: 'unset',
		},
	},

	toolbar: {
		backgroundColor: getApplicationColor(theme, 'toolbar'),
		justifyContent: 'space-between',

		button: {
			color: theme.colors.gray[6],
			transition: 'color 50ms ease-in',
			alignItems: 'center',
			display: 'flex',
			padding: `${theme.spacing.xs}`,

			'&:hover': {
				color: theme.colors.gray[3],
			},
		},
	},

	bottomBar: {
		padding: '0.5rem 0.525rem',
		backgroundColor: theme.colors.dark[7],
		borderRadius: theme.radius.sm,
	},
}));
