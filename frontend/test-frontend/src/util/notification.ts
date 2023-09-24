import { NotificationProps } from '@mantine/notifications';

export const NOTIFY_NOT_LOGGED_IN: NotificationProps = {
	title: 'Error',
	message: 'You are not logged in',
	color: 'red',
};

export const NOTIFY_SUBMISSION_RECEIVED: NotificationProps = {
	title: 'Sucess',
	message: 'We have received your submission',
	color: 'green',
};
