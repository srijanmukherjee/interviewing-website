import auth, { login, signout } from './auth';
import { createQuestion, deleteQuestion } from './question';
import { deleteSubmissions, gradeSubmission, unpackSubmissions } from './submission';

const authService = {
	auth,
	login,
	signout,
};

const questionService = {
	createQuestion,
	deleteQuestion,
};

const submissionService = {
	unpackSubmissions,
	deleteSubmissions,
	gradeSubmission,
};

export { authService, questionService, submissionService };
