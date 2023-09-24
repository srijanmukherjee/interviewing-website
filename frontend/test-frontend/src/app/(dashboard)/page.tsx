'use client';

import styles from './page.module.css';
import {
	Anchor,
	Avatar,
	Box,
	Button,
	Container,
	Flex,
	Group,
	MediaQuery,
	Text,
	Title,
	useMantineTheme,
} from '@mantine/core';
import links from '@/app/links';
import { getApplicationColor } from '../theme';
import Link from 'next/link';

export default function Page() {
	const theme = useMantineTheme();

	return (
		<>
			<Container size={'lg'}>
				<Flex align="center" justify="center" wrap="wrap">
					<MediaQuery smallerThan="sm" styles={{ flexBasis: '100%' }}>
						<Box
							style={{
								height: '40rem',
								padding: '1em',
								flexBasis: '50%',
								flexGrow: 1,
								position: 'relative',
								display: 'flex',
								alignItems: 'center',
							}}>
							<MediaQuery smallerThan={'sm'} styles={{ display: 'none' }}>
								<Box
									style={{
										position: 'absolute',
										width: '100%',
										height: '100%',
										left: '2.25rem',
										top: 0,
										transform: 'matrix(1, 0, -0.1, 1, 0, 0)',
										backgroundColor: getApplicationColor(theme, 'background'),
										zIndex: 1,
									}}
								/>
							</MediaQuery>
							<Box style={{ zIndex: 2 }}>
								<MediaQuery smallerThan={'md'} styles={{ fontSize: '2rem', lineHeight: '1.5em' }}>
									<Text style={{ color: 'white', fontSize: '3.75rem', lineHeight: '1.2em' }} mb={20}>
										Build your job profile even faster
									</Text>
								</MediaQuery>
								<Text mb={20}>
									Give a test consisting of over 180+ questions, handpicked by industry experts.
								</Text>
								<Button
									component="a"
									href={links.problems}
									color="secondary.6"
									size="lg"
									radius="sm"
									mb={20}
									style={{ color: theme.colors.dark[8] }}>
									Browse problems
								</Button>
								<Flex align="center" columnGap="3px">
									<Text color="gray">Powered by</Text>
									<Text color="gray" weight="bold" size="lg">
										localhost
									</Text>
								</Flex>
							</Box>
						</Box>
					</MediaQuery>
					<MediaQuery smallerThan={'sm'} styles={{ display: 'none' }}>
						<Box
							style={{
								height: '40rem',
								overflow: 'hidden',
								position: 'relative',
								flexBasis: '50%',
							}}>
							<div
								style={{
									position: 'absolute',
									left: 'calc(3rem * -1)',
									top: 'calc(3rem * -1)',
									transform: 'rotate(-10deg) translateZ(0px)',
									height: '1000px',
									width: '920px',
									background: 'transparent',
								}}>
								<div className={styles.hero}></div>
							</div>
						</Box>
					</MediaQuery>
				</Flex>

				{/* Link to apps */}
				<Box my="lg">
					<Title weight="normal" order={2} mb="lg">
						Connect with us here
					</Title>
					<Flex gap={10}>
						<Group
							sx={(theme) => ({
								borderRadius: theme.radius.sm,
								backgroundColor: 'rgba(255, 255, 255, 0.2)',
							})}
							py="sm"
							spacing="sm"
							pl={10}
							pr={10}>
							<Box
								sx={(theme) => ({
									background: theme.colors.dark[1],
									borderRadius: theme.radius.sm,
									padding: '10px',
								})}>
								<Avatar src="https://www.nytimes.com/favicon.ico" p="0" m="0" size={16} />
							</Box>
							<Anchor
								component={Link}
								href="https://www.nytimes.com/international/"
								color="white"
								target="_blank">
								NewYorkTimes
							</Anchor>
						</Group>
						<Group
							sx={(theme) => ({
								borderRadius: theme.radius.sm,
								backgroundColor: 'rgba(255, 255, 255, 0.2)',
							})}
							py="sm"
							spacing="sm"
							pl={10}
							pr={10}>
							<Box
								sx={(theme) => ({
									background: theme.colors.dark[1],
									borderRadius: theme.radius.sm,
									padding: '10px',
								})}>
								<Avatar src="https://www.theguardian.com/favicon.ico" p="0" m="0" size={16} />
							</Box>
							<Anchor
								component={Link}
								href="https://www.theguardian.com/international"
								color="white"
								target="_blank">
								The Guardian
							</Anchor>
						</Group>
					</Flex>
				</Box>
			</Container>
		</>
	);
}
