import { format } from 'date-fns';

const createLogMessage = (message: string) => {
	return `[${format(new Date(), 'dd-MMM-yyyy HH:mm:ss')}] ${message}`;
};

export { createLogMessage };
