import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
	title: {
		color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		textDecoration: 'none',
		fontSize: theme.fontSizes.lg,
	},

	question: {
		code: {
			backgroundColor: theme.colors.gray[8],
			padding: '0.125rem',
			borderRadius: '5px',
			display: 'inline-block',
			lineHeight: '1rem',
		},

		blockquote: {
			p: {
				margin: '0.125rem',
			},
		},
	},
}));
