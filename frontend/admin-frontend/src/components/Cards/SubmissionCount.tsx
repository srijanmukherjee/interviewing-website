import { Box, Flex, Group, Paper, ThemeIcon, Text } from '@mantine/core';
import { IconMessages } from '@tabler/icons-react';

interface Props {
	count: number;
}

export default function SubmissionCountCard({ count }: Props) {
	return (
		<Paper withBorder p="xl" shadow="xl" w="100%">
			<Flex align={'center'}>
				<ThemeIcon color="violet" variant="light" size="4rem">
					<IconMessages size="7.5rem" />
				</ThemeIcon>

				<Group position="right" style={{ flex: 1 }}>
					<Box>
						<Text tt="uppercase" size="xs">
							Submissions
						</Text>
						<Text ta="right" size={32} weight="bold">
							{count}
						</Text>
					</Box>
				</Group>
			</Flex>
		</Paper>
	);
}
