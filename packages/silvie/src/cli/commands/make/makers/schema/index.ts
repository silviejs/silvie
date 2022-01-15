import log from 'src/utils/log';
import { camelCase, pascalCase, snakeCase } from 'change-case';
import pluralize from 'pluralize';
import path from 'path';
import fs from 'fs';

const template = fs.readFileSync(path.resolve(__dirname, 'template'), { encoding: 'utf8' });

export default (args: { _: string[] }) => {
	const name = args._[2];

	if (name) {
		const filename = snakeCase(name);

		const schemasDir = path.resolve(process.rootPath, 'src/graphql/schemas');
		if (!fs.existsSync(schemasDir)) {
			fs.mkdirSync(schemasDir, { recursive: true });
		}

		const filepath = path.resolve(schemasDir, `${filename}.gql`);

		if (!fs.existsSync(filepath)) {
			const className = pascalCase(name);
			const singularName = camelCase(pluralize(name, 1));
			const pluralName = camelCase(pluralize(name));

			const content = template
				.replace(/CLASS_NAME/g, className)
				.replace(/SINGULAR_NAME/g, singularName)
				.replace(/PLURAL_NAME/g, pluralName);

			fs.writeFileSync(filepath, content);

			log.success('Schema Created', `'${className}' created successfully.`);
		} else {
			log.error('Schema Exists', `There is already a schema named '${filename}'`);
		}
	} else {
		log.error('No Name', 'You have to specify schema name');
	}
};
