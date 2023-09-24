import { DefaultMantineColor, MantineTheme, MantineThemeOverride, Tuple } from '@mantine/core';

type ExtendedColors = 'primary' | 'secondary' | DefaultMantineColor;

// typing support for custom colours
declare module '@mantine/core' {
	export interface MantineThemeColorsOverride {
		colors: Record<ExtendedColors, Tuple<string, 10>>;
	}
}

const extraColors = {
	bg: {
		dark: '#141414',
		light: '#fff',
	},
};

export const theme: MantineThemeOverride = {
	colorScheme: 'dark',
	colors: {
		// primary: [
		// 	'#E3F2FD',
		// 	'#BBDEFB',
		// 	'#90CAF9',
		// 	'#64B5F6',
		// 	'#42A5F5',
		// 	'#2196F3',
		// 	'#1E88E5',
		// 	'#1976D2',
		// 	'#1565C0',
		// 	'#1565C0',
		// ],
		primary: [
			'#dfffff',
			'#caffff',
			'#99fdfe',
			'#66fdfe',
			'#3efcfd',
			'#27fbfd',
			'#0bfbfd',
			'#00dfe1',
			'#00c7c9',
			'#00adaf',
		],
		// secondary: [
		// 	'#FFF9DB',
		// 	'#FFF3BF',
		// 	'#FFEC99',
		// 	'#FFE066',
		// 	'#FFD43B',
		// 	'#FCC419',
		// 	'#FAB005',
		// 	'#F59F00',
		// 	'#F08C00',
		// 	'#E67700',
		// ],
		secondary: [
			'#fffce1',
			'#fff8cc',
			'#ffef9b',
			'#ffe764',
			'#ffdf38',
			'#ffdb1c',
			'#ffd809',
			'#e3bf00',
			'#c9aa00',
			'#ae9200',
		],
		// yellow: ['#ffea0', '#ffee33', '#b2a300'],
	},

	primaryColor: 'primary',

	globalStyles: (theme) => ({
		body: {
			backgroundColor: getApplicationColor(theme, 'background'),
		},
	}),
};

export const getApplicationColor = (theme: MantineTheme, property: string) => {
	switch (property) {
		case 'toolbar':
			return theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2];
		case 'background':
			return theme.colorScheme === 'dark' ? extraColors.bg.dark : extraColors.bg.light;
		default:
			throw new Error(`invalid property "${property}"`);
	}
};
