const fs = require('fs/promises');
const path = require('path');

const handleDirectory = async (importPath) => {
	const dirFiles = await fs.readdir(importPath);
	const indexFile = dirFiles.find((file) => file.startsWith('index.'));

	if (indexFile) {
		return { path: path.join(importPath, indexFile) };
	}
};
const handleFile = async (importPath) => {
	const { dir: dirname, base: filename } = path.parse(importPath);
	const dirFiles = await fs.readdir(dirname);
	const importFile = dirFiles.find((file) => file.startsWith(filename));

	if (importFile) {
		return { path: path.join(dirname, importFile) };
	}
};

module.exports = (aliases = {}) => {
	const regExp = `^(${Object.keys(aliases)
		.map((alias) => alias.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
		.join('|')})`;
	const filterRegExp = new RegExp(regExp);
	const matchRegExp = new RegExp(`${regExp}/?`);

	return {
		name: 'alias-import',

		setup(build) {
			build.onResolve({ filter: filterRegExp }, async (args) => {
				const alias = args.path.match(filterRegExp)[1];
				const importPath = path.resolve(aliases[alias], args.path.replace(matchRegExp, ''));
				try {
					if (!path.extname(importPath)) {
						if ((await fs.stat(importPath)).isDirectory()) {
							return await handleDirectory(importPath);
						}

						return await handleFile(importPath);
					}
				} catch {
					return await handleFile(importPath);
				}
			});
		},
	};
};
