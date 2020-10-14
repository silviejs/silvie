import minimist from 'minimist';
import dotenv from 'dotenv';
import path from 'path';
import log from 'silviePath/utils/log';
import commands from 'silviePath/cli/commands';

const args = minimist(process.argv.slice(2));
dotenv.config({ path: path.resolve(process.rootPath, '.env') });

const [command] = args._;

if (command) {
	if (command in commands) {
		commands[command](args);
	} else {
		log.warning('[Silvie] Command Not Found');
		log(`There is no command named '${command}'`);
	}
} else {
	log.error('[Silvie] Invalid Usage');
	log('This is not how you use Silvie CLI');
	log('Run', log.str`silvie help`.underscore().bright(), 'for more info');
}
