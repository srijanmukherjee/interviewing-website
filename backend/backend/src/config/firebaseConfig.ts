import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const serviceAccount = process.env.FIREBASE_CONFIG_FILE!;

const app = initializeApp({
	credential: credential.cert(serviceAccount),
});

export const auth = getAuth(app);

export default app;
