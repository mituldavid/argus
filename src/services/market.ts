import axios from 'axios';
import { MarketMoodIndex } from '../types';
import MarketOverview from '../database/models/MarketOverview';

const getMarketMoodIndex = async (): Promise<MarketMoodIndex> => {
	const response = await axios.get('https://api.tickertape.in/mmi/now');
	return response.data.data;
};

const savePastMarketOverviews = async (MMI: MarketMoodIndex) => {
	const { lastDay, lastWeek, lastMonth, lastYear } = MMI;
	const docs = [lastDay, lastWeek, lastMonth, lastYear];

	const results = await Promise.all(
		docs.map(async (doc) => {
			return await MarketOverview.findOneAndUpdate(
				{ date: doc.date },
				{
					$setOnInsert: doc,
				},
				{ upsert: true, new: true },
			);
		}),
	);

	return results;
};

const saveCurrentMarketOverview = async (MMI: MarketMoodIndex) => {
	const { daily, lastDay, lastWeek, lastMonth, lastYear, currentValue, ...currentMetrics } = MMI;
	return await MarketOverview.findOneAndUpdate(
		{ date: currentMetrics.date },
		{
			$setOnInsert: currentMetrics,
		},
		{ upsert: true, new: true },
	);
};

export { getMarketMoodIndex, savePastMarketOverviews, saveCurrentMarketOverview };
