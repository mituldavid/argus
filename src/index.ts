import syncPastData from './jobs/syncPastData';
import syncLiveData from './jobs/syncLiveData';
import createDatabaseConnection from './database';
import { scheduleJob, gracefulShutdown, Range } from 'node-schedule';

createDatabaseConnection();

// Run every two minutes from 9AM to 4PM on Monday to Friday
// Crontab equivalent = '*/2 9-16 * * 1-5'
scheduleJob(
	{
		minute: new Range(0, 60, 2),
		hour: new Range(9, 16),
		dayOfWeek: new Range(1, 5),
		tz: 'Asia/Kolkata',
	},
	syncLiveData,
);

// Run at 8AM everyday
// Crontab equivalent = '0 8 * * *'
scheduleJob(
	{
		minute: 0,
		hour: 8,
		tz: 'Asia/Kolkata',
	},
	syncPastData,
);

// Gracefully shutdown jobs when a system interrupt occurs
process.on('SIGINT', async () => {
	console.info('SHUTTING DOWN JOBS GRACEFULLY');
	await gracefulShutdown();
	process.exit(0);
});
