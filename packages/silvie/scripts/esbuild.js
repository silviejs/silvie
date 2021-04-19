const fs = require('fs/promises');
const esbuild = require('esbuild');
const fastGlob = require('fast-glob');
const pkg = require('../package.json');

const aliasImport = require('./plugins/alias-import');
const wildcardImport = require('./plugins/wildcard-import');
const graphqlImport = require('./plugins/graphql-import');
const makeExternal = require('./plugins/make-external');

(async () => {
	try {
		console.log('Cleaning Build Directory...');
		await fs.rmdir('./lib', { recursive: true });

		console.log('Building...');
		console.time('build');
		await esbuild.build({
			entryPoints: await fastGlob('src/**/*.(js|ts)'),
			external: [...Object.keys(pkg.dependencies || {})],
			outbase: 'src',
			outdir: 'lib',
			platform: 'node',
			bundle: true,
			keepNames: true,
			plugins: [
				wildcardImport(),
				aliasImport({
					src: './src',
				}),
				graphqlImport(),
				makeExternal(),
			],
		});
		console.timeEnd('build');

		// console.log('Generating Type Definitions...');
		// console.time('tsc');
		// childProcess.exec('ttsc', async (typesError) => {
		// 	if (typesError) {
		// 		console.log('Build Failed: ', typesError);
		// 	} else {
		// 		try {
		// 			console.timeEnd('tsc');
		// 			console.log('Copying Package Files...');
		//
		// 			await fs.copyFile('LICENSE', 'lib/LICENSE');
		// 			await fs.copyFile('README.md', 'lib/README.md');
		//
		// 			const packageJson = JSON.parse(await fs.readFile('package.json', 'utf8'));
		// 			delete packageJson.scripts;
		// 			await fs.writeFile('lib/package.json', JSON.stringify(packageJson, null, '\t'), 'utf8');
		//
		// 			console.log('Build Finished Successfully');
		// 		} catch (error) {
		// 			console.log('Build Failed: ', error);
		// 		}
		// 	}
		// });
	} catch (error) {
		console.log('Error', error);
	}
})();
