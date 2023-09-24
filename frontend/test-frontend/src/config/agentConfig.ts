import axios from 'axios';
import auth from '../service/auth';

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL;
// axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
	if (auth.currentUser == undefined) return config;

	return new Promise((resolve, reject) => {
		auth.currentUser
			?.getIdToken()
			.then((token) => {
				config.headers.Authorization = `Bearer ${token}`;
			})
			.finally(() => resolve(config));
	});
});
