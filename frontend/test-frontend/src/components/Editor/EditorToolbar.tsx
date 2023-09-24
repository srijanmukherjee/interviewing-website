import { Badge, Flex, Group, UnstyledButton } from '@mantine/core';
import { useStyles } from './style';
import { workers } from './workers';
import LanguageSelect from '../LanguageSelector/LanguageSelector';
import { IconMinus, IconMoon, IconPlus, IconSun } from '@tabler/icons-react';

interface Props {
	language: string;
	setLanguage: (lang: string) => void;
	darkTheme: boolean;
	toggleTheme: (state: boolean) => void;
	fontSize: number;
	setFontSize: (size: number) => void;
}

export default function EditorToolbar({ language, setLanguage, darkTheme, toggleTheme, fontSize, setFontSize }: Props) {
	const { classes } = useStyles();

	return (
		<Flex className={classes.toolbar}>
			<LanguageSelect
				selected={language}
				onChange={setLanguage}
				data={Object.keys(workers).filter((worker) => worker !== 'editor')}
			/>
			<Group pr="sm" align="center">
				<Group align="center">
					<UnstyledButton onClick={() => setFontSize(Math.max(14, fontSize - 1))}>
						<IconMinus size={16} />
					</UnstyledButton>

					<Badge>{fontSize}px</Badge>

					<UnstyledButton onClick={() => setFontSize(Math.min(24, fontSize + 1))}>
						<IconPlus size={16} />
					</UnstyledButton>
				</Group>
				<UnstyledButton
					style={{ alignItems: 'center', display: 'flex' }}
					onClick={() => toggleTheme(!darkTheme)}>
					{darkTheme ? <IconMoon size={16} /> : <IconSun size={16} />}
				</UnstyledButton>
			</Group>
		</Flex>
	);
}
