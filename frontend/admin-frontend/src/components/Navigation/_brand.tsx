import { Box, Group, Text } from '@mantine/core';
import { IconAlignBoxLeftBottom, IconPlaceholder } from '@tabler/icons-react';

export default function Brand() {
	return (
		<Box p="xl" style={{ borderRadius: '0.725rem' }}>
			<Group>
				<IconAlignBoxLeftBottom size={32} color="grey" />
				<Text color="grey" weight="bolder" size="lg">
					InterviewPrep
				</Text>
			</Group>
		</Box>
	);
}
