import {
	getMarketMoodIndex,
	savePastMarketOverviews,
	saveCurrentMarketOverview,
} from './services/market';
import createDatabaseConnection from './database';
import { scheduleJob, Range } from 'node-schedule';
import { createLogMessage } from './services/utilities';
import { notify, notifyChangesToMMI } from './services/notification';
import MarketOverview from './database/models/MarketOverview';

createDatabaseConnection();

const job = async () => {
	try {
		console.group(' ');
		console.info(createLogMessage('JOB STARTING'));
		const MMI = await getMarketMoodIndex();
		const previousMarketOverview = await MarketOverview.findOne()
			.sort('-date')
			.select('indicator')
			.lean();

		const currentMarketOverview = await saveCurrentMarketOverview(MMI);
		await savePastMarketOverviews(MMI);
		console.info(createLogMessage('DATA UPDATED IN DB'));

		if (previousMarketOverview)
			await notifyChangesToMMI(previousMarketOverview.indicator, currentMarketOverview.indicator);

		console.info(createLogMessage('JOB COMPLETED'));
		console.groupEnd();
	} catch (error: any) {
		console.error(createLogMessage('ERROR:'), error);
		notify({
			message: error.toString(),
			title: 'Error encountered while syncing market overview',
			priority: 5,
		});
	}
};

// Run job every two minutes from 9AM to 4PM on Monday to Friday
// Crontab equivalent = '*/2 9-16 * * 1-5'
scheduleJob(
	{
		minute: new Range(0, 60, 2),
		hour: new Range(9, 16),
		dayOfWeek: new Range(1, 5),
		tz: 'Asia/Kolkata',
	},
	job,
);
