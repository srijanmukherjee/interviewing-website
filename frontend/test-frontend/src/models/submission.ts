export enum SubmissionStatus {
	SUBMITTED = 'submitted',
	PASS = 'pass',
	FAIL = 'fail',
	UNATTEMPTED = 'unattempted',
}

export interface UserSubmissions {
	[slug: string]: {
		grade?: string;
		data: {
			code?: {
				content: string;
				language: string;
			};

			video?: {
				location: string;
			};

			text?: {
				content: string;
			};
		};
		createdAt: number;
		feedback?: string;
		resubmitable?: boolean;
	};
}
