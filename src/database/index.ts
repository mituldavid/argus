import mongoose from 'mongoose';
import config from '../config';

const createDatabaseConnection = async () => {
	try {
		mongoose.set('strictQuery', false);
		const connection = await mongoose.connect(config.mongo.uri as string, {
			tls: true,
		});
		console.info(`Connected to MongoDB - ${connection.connection.host}`);
	} catch (error) {
		console.error(error);
	}
};

export default createDatabaseConnection;
