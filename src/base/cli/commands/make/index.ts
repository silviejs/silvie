import log from 'base/utils/log';
import makers from 'base/cli/commands/make/makers';

export default (args: { _: string[] }) => {
	const thing = args._[1];

	if (thing) {
		if (thing in makers) {
			makers[thing](args);
		} else {
			log.error('Unknown Maker', `There is no maker for '${thing}'`);
		}
	} else {
		log.error('Invalid Make', 'You need to specify what you want to be made');
	}
};
