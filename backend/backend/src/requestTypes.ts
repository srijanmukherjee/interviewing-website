import { FastifyRequest } from 'fastify';

export type ExecutionRequest = FastifyRequest<{
	Body: {
		code: string;
		stdin: string;
		language: string;
		timeLimit: string;
		memoryLimit: string;
		commandLineArguments: string;
	};
}>;

export type WebhookRequest = FastifyRequest<{
	Querystring: {
		token: string;
	};

	Body: {
		token?: string;
	};
}>;
