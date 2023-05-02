import { Schema, model } from 'mongoose';
import { NotificationLogStructure } from '../../types';

const NotificationLogSchema = new Schema<NotificationLogStructure>(
	{
		previousIndexValue: { type: Number, required: true },
		currentIndexValue: { type: Number, required: true },
		threshold: { type: Number, required: true },
		notifiedOn: { type: Date, default: () => new Date(), index: { unique: true } },
	},
	{ timestamps: true },
);

const NotificationLog = model<NotificationLogStructure>(
	'NotificationLog',
	NotificationLogSchema,
	'notification_log',
);

export default NotificationLog;
