import log from 'base/utils/log';
import { pascalCase, snakeCase } from 'change-case';
import path from 'path';
import fs from 'fs';

const template = fs.readFileSync(path.resolve(__dirname, 'template'), { encoding: 'utf8' });

export default (args: { _: string[] }) => {
	const name = args._[2];

	if (name) {
		const filename = snakeCase(name.replace(/[M|m]iddleware$/, ''));
		const filepath = path.resolve(process.rootPath, `src/middlewares/${filename}.ts`);

		if (!fs.existsSync(filepath)) {
			const className = pascalCase(/[M|m]iddleware$/.test(name) ? name : `${name}Middleware`);

			const content = template.replace(/CLASS_NAME/g, className).replace(/MIDDLEWARE_NAME/g, snakeCase(name));

			fs.writeFileSync(filepath, content);

			log.success('Middleware Created', `'${className}' created successfully.`);
		} else {
			log.error('Middleware Exists', `There is already a middleware named '${filename}'`);
		}
	} else {
		log.error('No Name', 'You have to specify middleware name');
	}
};
