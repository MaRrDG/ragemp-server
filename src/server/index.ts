import './basic/commands';
import './customs';
import './api';

import path from 'path';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import { rageConsole } from './../shared/utils';
mongoose.set('strictQuery', true);

config({
	path: path.resolve('.env')
});

async function main() {
	await mongoose.connect(process.env.MONGO_DB_URI || '');
}

main()
	.then(() => {
		rageConsole.load('Database loaded successfully.');
	})
	.catch((err) => rageConsole.error(err));
