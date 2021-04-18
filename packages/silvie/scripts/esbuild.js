const fs = require('fs/promises');
const path = require('path');
const esbuild = require('esbuild');
const fastGlob = require('fast-glob');
const pkg = require('../package.json');

const importPlugin = {
	name: 'import-plugin',
	setup(build) {
		build.onResolve({ filter: /.*/ }, (args) => {
			if (fastGlob.isDynamicPattern(args.path)) {
				console.log('onResolve', args);
			}
		});

		build.onLoad({ filter: /.*/, namespace: 'wildcard-import' }, (args) => {
			console.log('onLoad', args);
		});
	},
};

async function getFiles(dir) {
	const entries = await fs.readdir(dir, { withFileTypes: true });
	const files = await Promise.all(
		entries.map((entry) => {
			const res = path.join(dir, entry.name);
			return entry.isDirectory() ? getFiles(res) : res;
		})
	);
	return files.flat();
}

(async () => {
	try {
		const entries = await getFiles('src');

		await fs.rmdir('./dist', { recursive: true });

		await esbuild.build({
			platform: 'node',
			plugins: [importPlugin],
			entryPoints: entries,
			outdir: 'lib',
			outbase: 'src',
			external: [...Object.keys(pkg.dependencies || {})],
			bundle: true,
		});

		console.log('Build Finished!');
	} catch (error) {
		console.log('Error', error);
	}
})();
