'use client';

import { Loader } from '@mantine/core';

export default function Loading() {
	return (
		<Loader
			style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
			variant="bars"
			size="sm"
		/>
	);
}
