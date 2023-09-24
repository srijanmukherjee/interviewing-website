import { getApplicationColor } from '@/app/theme';
import { HEADER_HEIGHT } from '@/components/Header';
import { createStyles } from '@mantine/core';

export const useStyles = createStyles((theme) => ({
	split: {
		display: 'flex',
		flexDirection: 'row',
		'.gutter': {
			backgroundRepeat: 'no-repeat',
			backgroundPosition: '50%',
			transition: '200ms',

			'&:hover': {
				backgroundColor: theme.colors.primary[7],
			},
		},
		'.gutter.gutter-horizontal': {
			backgroundImage:
				"url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAeCAYAAADkftS9AAAAIklEQVQoU2M4c+bMfxAGAgYYmwGrIIiDjrELjpo5aiZeMwF+yNnOs5KSvgAAAABJRU5ErkJggg==')",
			cursor: 'col-resize',
			backgroundSize: '50%',
		},

		'& > div': {
			width: '50%',
			height: `calc(100vh - ${HEADER_HEIGHT} - 10px)`,
			borderRadius: '3px',
			overflow: 'hidden',
		},
	},

	tabs: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',

		'.mantine-Tabs-tabsList': {
			backgroundColor: getApplicationColor(theme, 'toolbar'),
		},
	},

	panelContainer: {
		flexGrow: 1,
		overflow: 'auto',
		padding: 15,
	},

	error404: {
		minHeight: `calc(100vh - ${HEADER_HEIGHT})`,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',

		'& > div': {
			flex: 1,
			height: '100% !important',
		},
	},
}));
