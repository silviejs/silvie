import log from 'base/utils/log';
import { pascalCase, snakeCase } from 'change-case';
import path from 'path';
import fs from 'fs';

const template = fs.readFileSync(path.resolve(__dirname, 'template'), { encoding: 'utf8' });

export default (args: { _: string[] }) => {
	const name = args._[2];

	if (name) {
		const filename = snakeCase(name);
		const filepath = path.resolve(process.rootPath, `src/models/${filename}.ts`);

		if (!fs.existsSync(filepath)) {
			const className = pascalCase(name);

			const content = template.replace('CLASS_NAME', className);

			fs.writeFileSync(filepath, content);

			log.success('Model Created', `'${className}' created successfully.`);
		} else {
			log.error('Model Exists', `There is already a model named '${filename}'`);
		}
	} else {
		log.error('No Name', 'You have to specify model name');
	}
};
