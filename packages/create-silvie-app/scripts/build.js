const fs = require('fs/promises');
const path = require('path');
const childProcess = require('child_process');
const ncp = require('ncp');

const rootPath = process.cwd();

(async () => {
	try {
		console.log('Cleaning Build Directory...');
		await fs.rm(path.resolve(rootPath, 'lib'), { recursive: true });

		console.log('Building...');
		childProcess.exec(
			`babel index.ts -d lib -x ".ts,.js"`,
			{ env: { ...process.env, NODE_ENV: 'production' } },
			(buildError) => {
				if (buildError) {
					console.log('Build Failed: ', buildError);
				} else {
					console.log('Copying Templates...');
					ncp(path.resolve(rootPath, 'templates'), path.resolve(rootPath, 'lib/templates'), async (copyError) => {
						if (copyError) {
							console.log('Build Failed: ', copyError);
						} else {
							try {
								console.log('Copying Package Files...');

								await fs.copyFile(path.resolve(rootPath, 'LICENSE'), path.resolve(rootPath, 'lib/LICENSE'));
								await fs.copyFile(path.resolve(rootPath, 'README.md'), path.resolve(rootPath, 'lib/README.md'));

								const packageJson = JSON.parse(await fs.readFile(path.resolve(rootPath, 'package.json'), 'utf8'));
								delete packageJson.scripts;
								await fs.writeFile(
									path.resolve(rootPath, 'lib/package.json'),
									JSON.stringify(packageJson, null, '\t'),
									'utf8'
								);

								console.log('Build Finished Successfully');
							} catch (error) {
								console.log('Build Failed: ', error);
							}
						}
					});
				}
			}
		);
	} catch (error) {
		console.log('Build Failed: ', error);
	}
})();
