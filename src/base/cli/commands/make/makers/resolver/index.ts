import log from 'base/utils/log';
import { snakeCase } from 'change-case';
import pluralize from 'pluralize';
import path from 'path';
import fs from 'fs';

const template = fs.readFileSync(path.resolve(__dirname, 'template'), { encoding: 'utf8' });

export default (args: { _: string[] }) => {
	const name = args._[2];

	if (name) {
		const filename = snakeCase(name);

		const resolversDir = path.resolve(process.rootPath, 'src/graphql/resolvers');
		if (!fs.existsSync(resolversDir)) {
			fs.mkdirSync(resolversDir, { recursive: true });
		}

		const filepath = path.resolve(resolversDir, `${filename}.ts`);

		if (!fs.existsSync(filepath)) {
			const singularName = snakeCase(pluralize(name, 1));
			const pluralName = snakeCase(pluralize(name));

			const content = template.replace(/SINGULAR_NAME/g, singularName).replace(/PLURAL_NAME/g, pluralName);

			fs.writeFileSync(filepath, content);

			log.success('Resolver Created', `'${filename}' created successfully.`);
		} else {
			log.error('Resolver Exists', `There is already a resolver named '${filename}'`);
		}
	} else {
		log.error('No Name', 'You have to specify resolver name');
	}
};
