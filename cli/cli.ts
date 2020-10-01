import minimist from 'minimist';
import dotenv from 'dotenv';
import path from 'path';

import commands from 'cli/commands';

const args = minimist(process.argv.slice(2));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const [command] = args._;

if (command) {
	if (command in commands) {
		commands[command](args);
	} else {
		console.log(`There is no '${command}' command`);
	}
} else {
	console.log('This is not how you use Silvie CLI');
	console.log('Run "silvie help" for more info');
}
