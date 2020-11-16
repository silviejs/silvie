import log from 'src/utils/log';
import { pascalCase, snakeCase } from 'change-case';
import pluralize from 'pluralize';
import path from 'path';
import fs from 'fs';

const template = fs.readFileSync(path.resolve(__dirname, 'template'), { encoding: 'utf8' });

export default (args: { _: string[] }) => {
	const name = args._[2];

	if (name) {
		const pluralName = pluralize(name);
		const filename = snakeCase(pluralName);

		const seedersDir = path.resolve(process.rootPath, 'src/database/seeders');
		if (!fs.existsSync(seedersDir)) {
			fs.mkdirSync(seedersDir, { recursive: true });
		}

		const filepath = path.resolve(seedersDir, `${filename}.ts`);

		if (!fs.existsSync(filepath)) {
			const className = `${pascalCase(pluralName)}TableSeeder`;

			const content = template.replace(/CLASS_NAME/g, className);

			fs.writeFileSync(filepath, content);

			log.success('Seeder Created', `'${filename}' created successfully.`);
		} else {
			log.error('Seeder Exists', `There is already a seeder named '${filename}'`);
		}
	} else {
		log.error('No Name', 'You have to specify seeder name');
	}
};
