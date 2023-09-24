import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
	valueBtn: {
		transition: '50ms',
		display: 'flex',
		alignItems: 'center',
		padding: `${theme.spacing.xs} ${theme.spacing.md}`,
		lineHeight: 1,
		fontSize: theme.fontSizes.sm,

		'&:hover': {
			color: theme.colorScheme === 'dark' ? theme.white : theme.black,
		},

		svg: {
			marginLeft: '5px',
		},
	},

	dropdown: {
		padding: theme.spacing.sm,
		maxHeight: '220px',
		overflow: 'auto',
	},

	list: {
		listStyle: 'none',
		padding: 0,
		margin: 0,

		'.mantine-List-item': {
			padding: 0,
			margin: 0,
		},

		'.mantine-List-itemWrapper': {
			width: '100%',
		},
	},

	popoverBtn: {
		padding: theme.spacing.sm,
		paddingRight: `calc(${theme.spacing.sm} + 30px)`,
		borderRadius: theme.radius.sm,
		width: '100%',
		position: 'relative',
		transition: '100ms ease-in',

		'&:hover': {
			backgroundColor: theme.colors.gray[8],
		},
	},

	selected: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		width: '30px',
		display: 'flex',
		alignItems: 'center',
		color: theme.colors.primary,
	},
}));
