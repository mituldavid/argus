import path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Global Configuration
const global = {
	env: process.env.NODE_ENV,
	mongo: {
		uri: process.env.MONGODB_URI,
	},
	ntfy: {
		url: process.env.NTFY_URL || 'https://ntfy.sh',
		topic: process.env.NTFY_TOPIC,
	},
};

// Development-Specific Configuration
const development = {};

// Production-Specific Configuration
const production = {};

// Load environment dependent configuration
const config = {
	...global,
	...(global.env === 'production' ? production : development),
};

export default config;
