export interface MarketOverviewStructure {
	fii: number;
	skew: number;
	nifty: number;
	gold: number;
	goldOnNifty: number;
	date: Date;
	extrema: number;
	trin: number;
	fma: number;
	sma: number;
	momentum: number;
	vix: number;
	raw: number;
	indicator: number;
}

export interface NotificationLogStructure {
	previousIndexValue: number;
	nextIndexValue: number;
	threshold: number;
	notifiedOn: Date;
}
