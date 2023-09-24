import { Box, List, Popover, Text, UnstyledButton } from '@mantine/core';
import { useStyles } from './LanguageSelector.styles';
import { IconCheck, IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';

interface Props {
	data: string[];
	selected: string;
	onChange?: (value: string) => void;
}

export default function LanguageSelect({ data, selected, onChange }: Props) {
	const { classes } = useStyles();
	const [opened, setOpened] = useState(false);

	const handleSelection = (value: string) => {
		setOpened((v) => !v);
		if (onChange) onChange(value);
	};

	return (
		<>
			<Popover position="bottom" shadow="md" opened={opened} onChange={setOpened}>
				<Popover.Target>
					<UnstyledButton className={classes.valueBtn} onClick={() => setOpened((v) => !v)}>
						{selected}

						<IconChevronDown size={16} />
					</UnstyledButton>
				</Popover.Target>
				<Popover.Dropdown className={classes.dropdown}>
					<List className={classes.list} size="sm" spacing="sm">
						{data.map((value, index) => (
							<List.Item key={value + index}>
								<UnstyledButton className={classes.popoverBtn} onClick={() => handleSelection(value)}>
									<Text>{value}</Text>
									{value === selected && (
										<Box className={classes.selected}>
											<IconCheck size={16} />
										</Box>
									)}
								</UnstyledButton>
							</List.Item>
						))}
					</List>
				</Popover.Dropdown>
			</Popover>
		</>
	);
}
