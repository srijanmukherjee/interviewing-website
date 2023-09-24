import { Skeleton } from '@mantine/core';
import { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
	visible: boolean;
}

export default function QuestionSkeleton({ visible, children }: Props) {
	const height = '1.25rem';

	if (visible) {
		return (
			<>
				<Skeleton height={height} width="100%" style={{ borderRadius: '12px' }} mt={10} />
				<Skeleton height={height} width="100%" style={{ borderRadius: '12px' }} mt={10} />
				<Skeleton height={height} width="90%" style={{ borderRadius: '12px' }} mt={10} />
				<Skeleton height={height} width="100%" style={{ borderRadius: '12px' }} mt={10} />
				<Skeleton height={height} width="50%" style={{ borderRadius: '12px' }} mt={10} />
				<br />
				<Skeleton height={height} width="75%" style={{ borderRadius: '12px' }} mt={10} />
				<Skeleton height={height} width="100%" style={{ borderRadius: '12px' }} mt={10} />
				<Skeleton height={height} width="100%" style={{ borderRadius: '12px' }} mt={10} />
			</>
		);
	}

	return children;
}
