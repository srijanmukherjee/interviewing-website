import { AxiosError, AxiosResponse } from 'axios';

interface Response {
	message: string;
}

export interface NetworkError {
	statusCode: number;
	reason: string;
	context?: AxiosError<Response>;
}
