import log from 'src/utils/log';
import * as makers from 'src/cli/commands/make/makers/*';

const entityMakers = ['model', 'seeder', 'migration', 'resolver', 'schema', 'dataloader'];

export default (args: {
	_: string[];
	M?: boolean;
	model?: boolean;
	S?: boolean;
	seeder?: boolean;
	m?: boolean;
	migration?: boolean;
	r?: boolean;
	resolver?: boolean;
	s?: boolean;
	schema?: boolean;
	d?: boolean;
	dataloader?: boolean;
}) => {
	const maker = args._[1];

	if (maker) {
		if (maker in makers) {
			makers[maker](args);

			if (entityMakers.includes(maker)) {
				const extraMakers = [];

				if (maker !== 'model' && (args.M || args.model)) {
					extraMakers.push('model');
				}
				if (maker !== 'seeder' && (args.S || args.seeder)) {
					extraMakers.push('seeder');
				}
				if (maker !== 'migration' && (args.m || args.migration)) {
					extraMakers.push('migration');
				}
				if (maker !== 'resolver' && (args.r || args.resolver)) {
					extraMakers.push('resolver');
				}
				if (maker !== 'schema' && (args.s || args.schema)) {
					extraMakers.push('schema');
				}
				if (maker !== 'dataloader' && (args.d || args.dataloader)) {
					extraMakers.push('dataloader');
				}

				extraMakers.forEach((extraMaker) => {
					makers[extraMaker](args);
				});
			}
		} else {
			log.error('Unknown Maker', `There is no maker for '${maker}'`);
		}
	} else {
		log.error('Invalid Make', 'You need to specify what you want to be made');
	}
};
