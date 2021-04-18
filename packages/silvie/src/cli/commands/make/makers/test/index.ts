import log from 'src/utils/log';
import { pascalCase, snakeCase } from 'change-case';
import path from 'path';
import fs from 'fs';

import template from './template.txt';

export default (args: { _: string[] }) => {
	const name = args._[2];

	if (name) {
		const testName = pascalCase(name);
		const filename = snakeCase(name);

		const testsDir = path.resolve(process.rootPath, 'tests');
		if (!fs.existsSync(testsDir)) {
			fs.mkdirSync(testsDir, { recursive: true });
		}

		const filepath = path.resolve(testsDir, `${filename}.test.js`);

		if (!fs.existsSync(filepath)) {
			const content = template.replace(/TEST_NAME/g, testName);

			fs.writeFileSync(filepath, content);

			log.success('Test Created', `'${filename}' created successfully.`);
		} else {
			log.error('Test Exists', `There is already a test named '${filename}'`);
		}
	} else {
		log.error('No Name', 'You have to specify test name');
	}
};
