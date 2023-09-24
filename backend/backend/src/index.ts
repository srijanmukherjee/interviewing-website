import Fastify, { FastifyInstance, FastifyReply } from 'fastify';
import { v4 as uuidv4 } from 'uuid';
import { isNumber } from 'lodash';
import cors from '@fastify/cors';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { ExecutionRequest, WebhookRequest } from './requestTypes';
import { languages } from './languageMapping';
import authenticate from './auth';

const server: FastifyInstance = Fastify({
	logger: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
	},
});

const port: number = parseInt(process.env.PORT ?? '') || 4000;

server.register(cors, {
	origin: '*',
});

// constants
const MAX_TIME_LIMIT = 10;
const MIN_TIME_LIMIT = 0.5;
const MAX_MEMORY_LIMIT = 512000;
const MIN_MEMORY_LIMIT = 2048;
const TIMEOUT_SEC = 2 * MAX_TIME_LIMIT;

// defaults
const defaultTimeLimit = parseInt(process.env.JUDGE0_DEFAULT_TIME_LIMIT ?? '2');
const defaultMemoryLimit = parseInt(process.env.JUDGE0_DEFAULT_MEMORY_LIMIT ?? '128000');

const maxWaitingConnections = parseInt(process.env.MAX_WAITING_CONNECTIONS ?? '100');
const waitingConnections = new Map<string, FastifyReply>();
const timeoutMap = new Map<string, NodeJS.Timeout>();
const supportedLanguages: string[] = Object.keys(languages);

server.put('/webhook/judge0/complete', (req: WebhookRequest, res) => {
	try {
		const { id } = jwt.verify(req.query.token, process.env.JWT_SECRET!) as { id: string };
		const conn = waitingConnections.get(id);

		// do not send the token back to client
		if (req.body !== undefined && req.body.token !== undefined) {
			delete req.body['token'];
		}

		conn?.send(req.body);

		waitingConnections.delete(id);
		clearTimeout(timeoutMap.get(id));
		timeoutMap.delete(id);
	} catch (_err) {
		console.log(_err);
		res.status(400);
	}

	res.send();
});

server.get(
	'/statistics/judge0',
	{
		onRequest: authenticate<ExecutionRequest>,
	},
	async (_req: ExecutionRequest, res) => {
		const data = await fetch(`${process.env.JUDGE0_SERVER}/statistics`).then((res) => {
			if (!res.ok) throw new Error('Execution server returned unexpected result');
			return res.json();
		});
		await res.send(data);
	},
);

server.post(
	'/execute',
	{
		preHandler: (req, reply, done) => {
			console.log(req.headers);
			if (req.routerMethod === 'OPTIONS') {
				return done();
			}

			return done();
		},
		onRequest: authenticate<ExecutionRequest>,
	},
	(req: ExecutionRequest, res) => {
		console.log(req.body.code);
		if (waitingConnections.size >= maxWaitingConnections) {
			res.status(500);
			throw new Error('Server is full, try again after sometime.');
		}

		// validate request
		let code = '',
			language = '';
		let commandLineArguments = '';
		let stdin = '';
		let timeLimit = defaultTimeLimit;
		let memoryLimit = defaultMemoryLimit;

		if (req.body === undefined) {
			res.status(400);
			res.send();
		}

		if (req.body.code === undefined || req.body.code.length === 0) {
			res.status(400);
			throw new Error('source code is empty');
		}

		if (!req.body.language === undefined) {
			res.status(400);
			throw new Error('source code language is required.');
		}

		if (supportedLanguages.indexOf(req.body.language) === -1) {
			res.status(400);
			throw new Error(`provided language is not supported`);
		}

		if (req.body.timeLimit !== undefined) {
			if (!isNumber(req.body.timeLimit)) {
				res.status(400);
				throw new Error('incorrect time limit');
			}

			const value = parseFloat(req.body.timeLimit);

			if (value > MAX_TIME_LIMIT || value < MIN_TIME_LIMIT) {
				res.status(400);
				throw new Error(`time limit out of range`);
			}

			timeLimit = value;
		}

		if (req.body.memoryLimit !== undefined) {
			if (!isNumber(memoryLimit)) {
				res.status(400);
				throw new Error('incorrect memory limit');
			}

			const value = parseFloat(req.body.memoryLimit);

			if (value < MIN_MEMORY_LIMIT || value > MAX_MEMORY_LIMIT) {
				res.status(400);
				throw new Error(`memory limit out of range`);
			}

			memoryLimit = value;
		}

		if (req.body.commandLineArguments && req.body.commandLineArguments.length > 512) {
			res.status(400);
			throw new Error('command line arguments length exceeded');
		}

		code = req.body.code.trim();
		language = req.body.language;
		stdin = req.body.stdin ?? '';
		commandLineArguments = req.body.commandLineArguments ?? '';

		// put the connection into waiting
		const id = uuidv4();
		waitingConnections.set(id, res);

		const payload = jwt.sign({ id }, process.env.JWT_SECRET!, {
			expiresIn: TIMEOUT_SEC,
		});

		const body: object = {
			source_code: code,
			language_id: languages[language],
			stdin: stdin,
			command_line_arguments: commandLineArguments,
			memory_limit: memoryLimit,
			time_limit: timeLimit,
			callback_url: `${process.env.JUDGE0_CALLBACK_URL}?token=${payload}`,
		};

		fetch(`${process.env.JUDGE0_SERVER}/submissions?base64_encoded=true`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json',
			},
		})
			.then((res) => res.json())
			.then((response) => {
				if (response.error !== undefined) {
					waitingConnections.delete(id);
					timeoutMap.delete(id);

					res.status(500);
					res.send('something went wrong');
				}
			})
			.catch((_err) => {
				waitingConnections.delete(id);
				timeoutMap.delete(id);

				// TODO: handle error

				res.status(500);
				res.send();
			});

		const timeoutId = setTimeout(() => {
			if (waitingConnections.has(id)) {
				timeoutMap.delete(id);
				waitingConnections.delete(id);
				res.status(408);
				res.send();
			}
		}, TIMEOUT_SEC * 1000);

		timeoutMap.set(id, timeoutId);
	},
);

server.listen({ port, host: '0.0.0.0' }, (err) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
});
