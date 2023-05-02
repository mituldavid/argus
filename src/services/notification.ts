import axios from 'axios';
import config from '../config';
import { differenceInHours } from 'date-fns';
import { NotificationPayload } from '../types';
import NotificationLog from '../database/models/NotificationLog';

/**
 * Wrapper to publish a ntfy message via HTTP
 */
const notify = async ({
	message,
	title,
	tags,
	priority = 3,
	attach,
	filename,
	click,
	actions,
}: NotificationPayload) => {
	await axios.post(config.ntfy.url, {
		topic: config.ntfy.topic,
		message,
		title,
		tags,
		priority,
		attach,
		filename,
		click,
		actions,
	});
};

const getHoursSinceLastNotification = async () => {
	const latestLog = await NotificationLog.findOne().sort('-notifiedOn').lean();
	if (latestLog) {
		return Math.abs(differenceInHours(new Date(), latestLog.notifiedOn));
	}
	return Infinity;
};

/**
 * Send a notification if the MMI has dropped below the set thresholds
 */
const notifyIfBelowThreshold = async (previousIndexValue: number, currentIndexValue: number) => {
	const thresholds = [10, 15, 20, 25, 30];
	const hoursSinceLastNotification = await getHoursSinceLastNotification();

	for (const threshold of thresholds) {
		let allowRepeatedNotification = false;
		if (threshold <= 20) allowRepeatedNotification = hoursSinceLastNotification > 24;

		if (
			currentIndexValue < threshold &&
			(previousIndexValue >= threshold || allowRepeatedNotification)
		) {
			await notify({
				message: `MMI = ${currentIndexValue}`,
				title: `MMI has sunk below ${threshold}`,
				click: 'https://stocks.zerodha.com',
			});
			await NotificationLog.updateOne(
				{},
				{ previousIndexValue, currentIndexValue, threshold },
				{ upsert: true },
			);
			console.info('NOTIFICATION SENT');
			break;
		}
	}
};

export { notify, notifyIfBelowThreshold, getHoursSinceLastNotification };
