import minimist from 'minimist';
import dotenv from 'dotenv';
import path from 'path';
import Database from 'base/database';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// eslint-disable-next-line import/extensions
import commands from './commands';

const args = minimist(process.argv.slice(2));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

Database.init();

const [command] = args._;

if (command in commands) {
	commands[command](args)
		.then(() => {
			Database.closeConnection();
		})
		.catch(() => {
			Database.closeConnection();
		});
} else {
	console.log(`There is no '${command}' command`);
}
