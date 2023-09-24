import { Question } from '@/models';
import { ref, set, serverTimestamp } from 'firebase/database';
import { getDownloadURL, getStorage, ref as storageRef, uploadBytes } from 'firebase/storage';
import { uuidv4 } from '@firebase/util';
import { database } from '@/config/firebaseConfig';

export async function submitCodingAnswer(uid: string, question: Question, content: string, language: string) {
	const submissionRef = ref(database, `web/submissions/${uid}/${question.slug}`);
	return set(submissionRef, {
		data: {
			code: {
				content: btoa(content),
				language,
			},
		},
		createdAt: serverTimestamp(),
	});
}

export async function submitVideoAnswer(uid: string, question: Question, video: Blob) {
	const storage = getStorage();
	const filePath = `${uid}/${uuidv4()}_${new Date().getTime()}.webm`;
	const submissionRef = ref(database, `web/submissions/${uid}/${question.slug}`);
	const fileRef = storageRef(storage, filePath);
	try {
		const result = await uploadBytes(fileRef, video);
		console.log(result);
		// add submission record
		return set(submissionRef, {
			data: {
				video: {
					location: await getDownloadURL(fileRef),
				},
			},
			createdAt: serverTimestamp(),
		});
	} catch (error) {
		throw new Error('Submission failed');
	}
}

export async function submitTextAnswer(uid: string, question: Question, content: string) {
	const submissionRef = ref(database, `web/submissions/${uid}/${question.slug}`);
	return set(submissionRef, {
		data: {
			text: {
				content: btoa(content),
			},
		},
		createdAt: serverTimestamp(),
	});
}
