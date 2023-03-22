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

export interface NotificationLogStructure {
	previousIndexValue: number;
	nextIndexValue: number;
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
