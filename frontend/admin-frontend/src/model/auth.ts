import { User } from 'firebase/auth';

export interface AuthModel {
	loaded: boolean;
	user: User | null;
}
