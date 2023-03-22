import axios from 'axios';
import config from '../config';
import { differenceInHours } from 'date-fns';
import { NotificationPayload } from '../types';
import NotificationLog from '../database/models/NotificationLog';

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

const notifyChangesToMMI = async (previousIndexValue: number, currentIndexValue: number) => {
	let hoursSinceLastNotification;
	const thresholds = [10, 15, 20, 25, 30];

	for (const threshold of thresholds) {
		let allowRepeatedNotification = false;
		if (threshold <= 20) {
			hoursSinceLastNotification ||= await getHoursSinceLastNotification();
			allowRepeatedNotification = hoursSinceLastNotification > 24;
		}

		if (
			currentIndexValue < threshold &&
			(previousIndexValue >= threshold || allowRepeatedNotification)
		) {
			await notify({
				message: `MMI = ${currentIndexValue}`,
				title: `MMI has sunk below ${threshold}`,
				click: 'https://stocks.zerodha.com',
			});
			await NotificationLog.findOneAndUpdate(
				{},
				{ previousIndexValue, currentIndexValue, threshold },
				{ upsert: true },
			);
			break;
		}
	}
};

export { notify, notifyChangesToMMI, getHoursSinceLastNotification };
