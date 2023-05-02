import { NtfyAction } from './ntfy';

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

export interface MarketMoodIndex extends MarketOverviewStructure {
	daily: { value: number; date: Date }[];
	lastDay: MarketOverviewStructure;
	lastWeek: MarketOverviewStructure;
	lastMonth: MarketOverviewStructure;
	lastYear: MarketOverviewStructure;
	currentValue: number;
}

export interface NotificationLogStructure {
	previousIndexValue: number;
	currentIndexValue: number;
	threshold: number;
	notifiedOn: Date;
}

export interface NotificationPayload {
	message: string;
	title: string;
	tags?: string[];
	priority?: number;
	attach?: string;
	filename?: string;
	click?: string;
	actions?: NtfyAction[];
}
