import app from '@/config/firebase';
import { getAuth, signInWithEmailAndPassword, signOut, browserLocalPersistence } from 'firebase/auth';

const auth = getAuth(app);

export async function login(email: string, password: string) {
	return signInWithEmailAndPassword(auth, email, password).then((userCredential) => userCredential.user);
}

export async function signout() {
	return signOut(auth);
}

export default auth;
