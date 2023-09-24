import { createStyles, keyframes } from '@mantine/core';

const animatedIcon = keyframes({
	'0%': { outline: '0px solid initial' },
	'100%': { outline: '10px solid transparent' },
});

export const useStyles = createStyles((theme) => ({
	animatedIcon: {
		borderRadius: '50%',
		animation: `${animatedIcon} 1500ms infinite forwards`,
	},
}));
