import log from 'base/utils/log';
import { snakeCase } from 'change-case';
import path from 'path';
import fs from 'fs';

const template = fs.readFileSync(path.resolve(__dirname, 'template'), { encoding: 'utf8' });

export default (args: { _: string[] }) => {
	const name = args._[2];

	if (name) {
		const filename = snakeCase(name);
		const filepath = path.resolve(process.rootPath, `src/graphql/dataloaders/${filename}.ts`);

		if (!fs.existsSync(filepath)) {
			fs.writeFileSync(filepath, template);

			log.success('DataLoader Created', `'${filename}' created successfully.`);
		} else {
			log.error('DataLoader Exists', `There is already a data loader named '${filename}'`);
		}
	} else {
		log.error('No Name', 'You have to specify data loader name');
	}
};
