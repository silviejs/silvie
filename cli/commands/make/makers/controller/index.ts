import fs from 'fs';
import path from 'path';
import log from 'silviePath/utils/log';
import { pascalCase, snakeCase } from 'change-case';

const template = fs.readFileSync(path.resolve(__dirname, 'template'), { encoding: 'utf8' });

export default (args: { _: string[] }) => {
	const name = args._[2];

	if (name) {
		const filename = snakeCase(name.replace(/[C|c]ontroller$/, ''));

		const controllersDir = path.resolve(process.rootPath, 'src/controllers');
		if (!fs.existsSync(controllersDir)) {
			fs.mkdirSync(controllersDir, { recursive: true });
		}

		const filepath = path.resolve(controllersDir, `${filename}.ts`);

		if (!fs.existsSync(filepath)) {
			const className = pascalCase(/[C|c]ontroller$/.test(name) ? name : `${name}Controller`);

			const content = template
				.replace(/CLASS_NAME/g, className)
				.replace(/ROUTE_URL/g, snakeCase(className))
				.replace(/ROUTE_RESPONSE/g, `${pascalCase(name)} Controller Default Response`);

			fs.writeFileSync(filepath, content);

			log.success('Controller Created', `'${className}' created successfully.`);
		} else {
			log.error('Controller Exists', `There is already a controller named '${filename}'`);
		}
	} else {
		log.error('No Name', 'You have to specify controller name');
	}
};
