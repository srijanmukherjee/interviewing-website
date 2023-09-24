import app from '@/config/firebaseConfig';
import { getAuth, signInWithEmailAndPassword, signOut, browserLocalPersistence } from 'firebase/auth';

const auth = getAuth(app);

if (process.browser)
	(async () => {
		await auth.setPersistence(browserLocalPersistence);
	})();

export async function login(email: string, password: string) {
	return signInWithEmailAndPassword(auth, email, password).then((userCredential) => {
		userCredential.user.uid;
	});
}

export async function signout() {
	return signOut(auth);
}

export default auth;
