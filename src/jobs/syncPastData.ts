import { notify } from '../services/notification';
import { getMarketMoodIndex, savePastMarketOverviews } from '../services/market';

/**
 * Save the market overview from the last day, week, month and year into the database
 */
const syncPastData = async () => {
	try {
		console.info('SYNCING PAST DATA');
		const MMI = await getMarketMoodIndex();
		await savePastMarketOverviews(MMI);
		console.info('COMPLETED');
	} catch (error: any) {
		console.error('ERROR ENCOUNTERED WHILE SYNCING PAST DATA:', error);
		notify({
			message: error.toString(),
			title: 'Error encountered while syncing past market overview',
			priority: 5,
		});
	}
};

export default syncPastData;
