import { Schema, model } from 'mongoose';
import { MarketOverviewStructure } from '../../types';

const MarketOverviewSchema = new Schema<MarketOverviewStructure>(
	{
		fii: { type: Number },
		skew: { type: Number },
		nifty: { type: Number, required: true },
		gold: { type: Number },
		goldOnNifty: { type: Number },
		date: { type: Date, index: { unique: true } },
		extrema: { type: Number },
		trin: { type: Number },
		fma: { type: Number },
		sma: { type: Number },
		momentum: { type: Number },
		vix: { type: Number },
		raw: { type: Number },
		indicator: { type: Number, required: true },
	},
	{ timestamps: true },
);

const MarketOverview = model<MarketOverviewStructure>(
	'MarketOverview',
	MarketOverviewSchema,
	'market_overview',
);

export default MarketOverview;
