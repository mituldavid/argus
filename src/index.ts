import {
	getMarketMoodIndex,
	savePastMarketOverviews,
	saveCurrentMarketOverview,
} from './services/market';
import { createLogMessage } from './services/utilities';
import { notify, notifyChangesToMMI } from './services/notification';

import createDatabaseConnection from './database';
import MarketOverview from './database/models/MarketOverview';

import { scheduleJob, Range, gracefulShutdown } from 'node-schedule';

createDatabaseConnection();

const syncLiveData = async () => {
	try {
		console.info(createLogMessage('SYNCING LIVE DATA'));
		const MMI = await getMarketMoodIndex();
		const previousMarketOverview = await MarketOverview.findOne()
			.sort('-date')
			.select('indicator')
			.lean();

		const currentMarketOverview = await saveCurrentMarketOverview(MMI);
		console.info(createLogMessage('DATA UPDATED IN DB'));

		if (previousMarketOverview)
			await notifyChangesToMMI(previousMarketOverview.indicator, currentMarketOverview.indicator);

		console.info(createLogMessage('COMPLETED'));
	} catch (error: any) {
		console.error(createLogMessage('ERROR ENCOUNTERED WHILE SYNCING LIVE DATA:'), error);
		notify({
			message: error.toString(),
			title: 'Error encountered while syncing live market overview',
			priority: 5,
		});
	}
};

const syncPastData = async () => {
	try {
		console.info(createLogMessage('SYNCING PAST DATA'));
		const MMI = await getMarketMoodIndex();
		await savePastMarketOverviews(MMI);
		console.info(createLogMessage('COMPLETED'));
	} catch (error: any) {
		console.error(createLogMessage('ERROR ENCOUNTERED WHILE SYNCING PAST DATA:'), error);
		notify({
			message: error.toString(),
			title: 'Error encountered while syncing past market overview',
			priority: 5,
		});
	}
};

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
