import { Text } from '@mantine/core';
import { IconCircleFilled } from '@tabler/icons-react';
import { useStyles } from './style';

export function DisplaySubmissionStatus({ grade }: { grade?: string }) {
	const { classes } = useStyles();

	return (
		<Text
			size={28}
			style={{
				display: 'flex',
				alignItems: 'center',
			}}>
			<IconCircleFilled
				size={16}
				style={{ marginRight: 15, color: grade ? (grade === 'pass' ? 'lightgreen' : 'red') : 'white' }}
				className={classes.animatedIcon}
			/>
			{grade ? (grade === 'pass' ? 'Passed' : 'Failed') : 'Submitted'}
		</Text>
	);
}
