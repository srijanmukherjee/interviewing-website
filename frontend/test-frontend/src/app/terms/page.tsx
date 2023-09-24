'use client';

import { Text, Container, Title, List, Box } from '@mantine/core';

export default function TermsPage() {
	return (
		<Container size="lg" my={20}>
			<Title order={3}>Terms and Conditions for {process.env.NEXT_PUBLIC_APPLICATION_NAME}</Title>
			<Box>
				<Title order={5} my={10}>
					Introduction
				</Title>
				<Text color="gray">
					These Website Standard Terms and Conditions written on this webpage shall manage your use of our
					website, Webiste Name accessible at Website.com. These Terms will be applied fully and affect to
					your use of this Website.
					<br />
					<br />
					By using this Website, you agreed to accept all terms and conditions written in here. You must not
					use this Website if you disagree with any of these Website Standard Terms and Conditions. Minors or
					people below 18 years old are not allowed to use this Website.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					Intellectual Property Rights
				</Title>
				<Text color="gray">
					Other than the content you own, under these Terms, Company Name and/or its licensors own all the
					intellectual property rights and materials contained in this Website.
					<br />
					You are granted limited license only for purposes of viewing the material contained on this Website.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					Restrictions
				</Title>
				<Text color="gray">You are specifically restricted from all of the following:</Text>
				<br />
				<List sx={(theme) => ({ color: 'gray' })}>
					<List.Item>publishing any Website material in any other media;</List.Item>
					<List.Item>selling, sublicensing and/or otherwise commercializing any Website material;</List.Item>
					<List.Item>publicly performing and/or showing any Website material;</List.Item>
					<List.Item>using this Website in any way that is or may be damaging to this Website;</List.Item>
					<List.Item>using this Website in any way that impacts user access to this Website;</List.Item>
					<List.Item>
						using this Website contrary to applicable laws and regulations, or in any way may cause harm to
						the Website, or to any person or business entity;
					</List.Item>
					<List.Item>
						engaging in any data mining, data harvesting, data extracting or any other similar activity in
						relation to this Website;
					</List.Item>
					<List.Item>using this Website to engage in any advertising or marketing.</List.Item>
				</List>

				<br />

				<Text color="gray">
					Certain areas of this Website are restricted from being access by you and Company Name may further
					restrict access by you to any areas of this Website, at any time, in absolute discretion. Any user
					ID and password you may have for this Website are confidential and you must maintain confidentiality
					as well.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					Your Content
				</Title>
				<Text color="gray">
					In these Website Standard Terms and Conditions, “Your Content” shall mean any audio, video text,
					images or other material you choose to display on this Website. By displaying Your Content, you
					grant Company Name a non-exclusive, worldwide irrevocable, sub licensable license to use, reproduce,
					adapt, publish, translate and distribute it in any and all media.
					<br />
					Your Content must be your own and must not be invading any third-party&apos;s rights. Company Name
					reserves the right to remove any of Your Content from this Website at any time without notice.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					No warranties
				</Title>
				<Text color="gray">
					This Website is provided “as is,” with all faults, and Company Name express no representations or
					warranties, of any kind related to this Website or the materials contained on this Website. Also,
					nothing contained on this Website shall be interpreted as advising you.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					Limitation of liability
				</Title>
				<Text color="gray">
					In no event shall Company Name, nor any of its officers, directors and employees, shall be held
					liable for anything arising out of or in any way connected with your use of this Website whether
					such liability is under contract. Company Name, including its officers, directors and employees
					shall not be held liable for any indirect, consequential or special liability arising out of or in
					any way related to your use of this Website.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					Indemnification
				</Title>
				<Text color="gray" weight="bolder">
					You hereby indemnify to the fullest extent Company Name from and against any and/or all liabilities,
					costs, demands, causes of action, damages and expenses arising in any way related to your breach of
					any of the provisions of these Terms.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					Severability
				</Title>
				<Text color="gray">
					If any provision of these Terms is found to be invalid under any applicable law, such provisions
					shall be deleted without affecting the remaining provisions herein.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					Variation of Terms
				</Title>
				<Text color="gray">
					Company Name is permitted to revise these Terms at any time as it sees fit, and by using this
					Website you are expected to review these Terms on a regular basis.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					Assignment
				</Title>
				<Text color="gray">
					The Company Name is allowed to assign, transfer, and subcontract its rights and/or obligations under
					these Terms without any notification. However, you are not allowed to assign, transfer, or
					subcontract any of your rights and/or obligations under these Terms.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					Entire Agreement
				</Title>
				<Text color="gray">
					These Terms constitute the entire agreement between Company Name and you in relation to your use of
					this Website, and supersede all prior agreements and understandings.
				</Text>
			</Box>
			<Box>
				<Title order={5} my={10}>
					Governing Law & Jurisdiction
				</Title>
				<Text color="gray">
					These Terms will be governed by and interpreted in accordance with the laws of the State of Country,
					and you submit to the non-exclusive jurisdiction of the state and federal courts located in Country
					for the resolution of any disputes.
				</Text>
			</Box>
		</Container>
	);
}
