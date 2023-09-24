import { getApplicationColor } from '@/app/theme';
import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
	table: {
		thead: {
			borderBottom: '1px solid #eee',
		},

		tr: {
			backgroundColor: getApplicationColor(theme, 'background'),
		},

		a: {
			textDecoration: 'none',
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,

			'&:hover': {
				color: theme.colors.secondary[6],
			},
		},
	},
}));
