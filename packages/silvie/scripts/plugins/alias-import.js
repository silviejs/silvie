// const fs = require('fs/promises');
const path = require('path');

// const cwd = process.cwd();

const aliasImport = {
	name: 'alias-import',

	setup(build) {
		build.onResolve({ filter: /^src[^*]+$/ }, (args) => {
			if (args.kind === 'import-statement') {
				return { path: `./${path.relative(args.resolveDir, args.path)}`, external: true };
			}
		});
		// build.onResolve({ filter: /^\./ }, (args) => {
		// 	if (args.kind === 'import-statement' && !args.path.endsWith('txt')) {
		// 		let relativePath = path
		// 			.relative(args.resolveDir, path.join(args.resolveDir, args.path))
		// 			.replace(/\.ts$/, '.js');
		//
		// 		if (!relativePath.includes('/')) {
		// 			relativePath = `./${relativePath}`;
		// 		}
		//
		// 		return { path: relativePath, external: true };
		// 	}
		// });
	},
};

module.exports = aliasImport;
