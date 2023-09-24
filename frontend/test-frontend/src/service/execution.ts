import '@/config/agentConfig';
import { NetworkError } from '@/models/error';
import axios, { AxiosError } from 'axios';
import { Agent } from 'https';

export default async function executeCode(
	code: string,
	language: string,
	stdin: string,
	commandLineArguments: string,
	memoryLimit?: string,
	timeLimit?: string
) {
	const payload: any = {
		code: btoa(code),
		language: language,
		stdin: btoa(stdin),
		commandLineArguments: commandLineArguments,
	};

	if (memoryLimit) payload.memoryLimit = memoryLimit;

	if (timeLimit) payload.timeLimit = timeLimit;

	return axios.post('/execute', payload, {
		httpsAgent: new Agent({
			// Expect: self signed certs to work (SECURITY PROBLEM)
			rejectUnauthorized: false,
		}),
	});
}

export function handleExecutionError(error: Error): NetworkError {
	if (error instanceof AxiosError) {
		const response = error.response;

		if (response) {
			if (process.env.NODE_ENV == 'development') console.log(response.data);

			return {
				statusCode: response.status,
				reason: response.statusText ?? 'Something went wrong',
				context: error,
			};
		}

		return {
			statusCode: -1,
			reason: error.message ?? 'Something went wrong',
			context: error,
		};
	}

	return {
		statusCode: -1,
		reason: 'something went wrong',
	};
}
