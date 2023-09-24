import { submissionsAtom } from '@/state/submissions';
import { useAtom } from 'jotai';
import { useMemo } from 'react';

export default function useSubmissions(slug: string) {
	const [userSubmissions] = useAtom(submissionsAtom);

	const submissions = useMemo(() => {
		if (!userSubmissions || !userSubmissions[slug]) return null;
		return userSubmissions[slug];
	}, [userSubmissions, slug]);

	return submissions;
}
