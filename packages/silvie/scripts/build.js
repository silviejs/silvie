const fs = require('fs/promises');
const path = require('path');
const childProcess = require('child_process');

const rootPath = process.cwd();

(async () => {
	try {
		console.log('Cleaning Build Directory...');
		await fs.rmdir(path.resolve(rootPath, 'lib'), { recursive: true });

		console.log('Building...');
		childProcess.exec(
			`babel src -d lib -x ".ts,.js" --copy-files --config-file`,
			{ env: { ...process.env, NODE_ENV: 'production' } },
			async (buildError) => {
				if (buildError) {
					return console.log('Build Failed: ', buildError);
				}

				console.log('Generating Type Definitions...');
				childProcess.exec('ttsc', async (ttscError) => {
					if (ttscError) {
						return console.log('Build Failed: ', ttscError);
					}

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
				});
			}
		);
	} catch (error) {
		console.log('Build Failed: ', error);
	}
})();
