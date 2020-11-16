import path from 'path';
import fs from 'fs';
import log from 'src/utils/log';

const [command] = process.args._;

if (command) {
	const commandPath = path.resolve(__dirname, `./commands/${command}`);

	if (fs.existsSync(commandPath)) {
		// eslint-disable-next-line @typescript-eslint/no-var-requires,global-require,import/no-dynamic-require
		require(commandPath).default(process.args);
	} else {
		log.warning('[Silvie] Command Not Found');
		log(`There is no command named '${command}'`);
	}
} else {
	log.error('[Silvie] Invalid Usage');
	log('This is not how you use Silvie CLI');
	log('Run', log.str`silvie help`.underscore().bright(), 'for more info');
}
