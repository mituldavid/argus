import MarketOverview from '../database/models/MarketOverview';
import { notify, notifyIfBelowThreshold } from '../services/notification';
import { getMarketMoodIndex, saveCurrentMarketOverview } from '../services/market';

/**
 * Save the current market overview into the database and send a notification if the MMI has dropped below set thresholds
 */
const syncLiveData = async () => {
	try {
		console.info('SYNCING LIVE DATA');
		const MMI = await getMarketMoodIndex();
		const previousMarketOverview = await MarketOverview.findOne()
			.sort('-date')
			.select('indicator')
			.lean();

		const currentMarketOverview = await saveCurrentMarketOverview(MMI);
		console.info('DATA UPDATED IN DB');

		if (previousMarketOverview) {
			await notifyIfBelowThreshold(
				previousMarketOverview.indicator,
				currentMarketOverview.indicator,
			);
		}
		console.info('COMPLETED');
	} catch (error: any) {
		console.error('ERROR ENCOUNTERED WHILE SYNCING LIVE DATA:', error);
		notify({
			message: error.toString(),
			title: 'Error encountered while syncing live market overview',
			priority: 5,
		});
	}
};

export default syncLiveData;
