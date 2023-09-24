import { FastifyReply, FastifyRequest } from 'fastify';
import { constants } from 'http2';
import { auth } from './config/firebaseConfig';

export default async function authenticate<T extends FastifyRequest>(request: T, reply: FastifyReply) {
	const authHeader = request.headers.authorization;

	if (!authHeader || !authHeader.startsWith('Bearer ')) {
		reply.status(constants.HTTP_STATUS_BAD_REQUEST);
		return reply.send();
	}

	const idToken = authHeader?.split(' ')[1] as string;

	try {
		await auth.verifyIdToken(idToken);
	} catch (err) {
		reply.status(constants.HTTP_STATUS_UNAUTHORIZED);
		return reply.send();
	}
}
