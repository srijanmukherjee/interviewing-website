import { MantineColor, MantineTheme } from '@mantine/core';

const notificationStyle = (color: MantineColor) => {
	return (theme: MantineTheme) => ({
		root: {
			backgroundColor: theme.fn.themeColor(color, 6),
			borderColor: theme.fn.themeColor(color, 6),

			'&::before': { backgroundColor: theme.white },
		},

		title: { color: theme.white },
		description: { color: theme.white },
		closeButton: {
			color: theme.white,
			'&:hover': { backgroundColor: theme.colors.green[7] },
		},
	});
};

export const DELETE_SUCCESSFUL_NOTFICATION = {
	title: 'Deleted',
	message: `Question successfully deleted`,
	withBorder: true,
	styles: notificationStyle('green'),
};

export const DELETE_FAILED_NOTIFICATION = {
	title: 'Error',
	message: 'Failed to delete question',
	withBorder: true,
	styles: notificationStyle('red'),
};

export const EVALUATION_SUCCESS_NOTIFICATION = {
	title: 'Success',
	message: 'Evaluation submitted successfully',
	withBorder: true,
	styles: notificationStyle('green'),
};

export const EVALUATION_FAILURE_NOTIFICATION = {
	title: 'Failure',
	message: 'Unable to submit your evaluation. Check logs for more info.',
	withBorder: true,
	styles: notificationStyle('red'),
};
