export enum Grade {
	PASS = 'pass',
	FAIL = 'fail',
}

interface BaseSubmission {
	uid: string;
	slug: string;
	createdAt: number;
	grade?: Grade;
	resubmitable?: boolean;
	feedback?: string;
}

interface VideoSubmission extends BaseSubmission {
	data: {
		video: {
			location: string;
		};
	};
}

interface CodingSubmission extends BaseSubmission {
	data: {
		code: {
			content: string;
			language: string;
		};
	};
}

interface TextSubmission extends BaseSubmission {
	data: {
		text: {
			content: string;
		};
	};
}

type Submission = CodingSubmission | VideoSubmission | TextSubmission;

export default Submission;
