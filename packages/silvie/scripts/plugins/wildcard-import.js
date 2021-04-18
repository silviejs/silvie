const path = require('path');
const fastGlob = require('fast-glob');

const wildcardImport = {
	name: 'wildcard-import',

	setup(build) {
		build.onResolve({ filter: /\*/ }, (args) => {
			if (fastGlob.isDynamicPattern(args.path)) {
				return {
					path: args.path,
					namespace: 'wildcard-import',
					pluginData: {
						resolveDir: args.resolveDir,
					},
				};
			}
		});

		build.onLoad({ filter: /.*/, namespace: 'wildcard-import' }, async (args) => {
			const files = (await fastGlob(args.path)).map(path.parse);

			const contents = `
            ${files.map((file) => `import module_${file.name} from '${file.dir}/${file.base}';`).join('\n')}
            ${files.map((file) => `export const ${file.name} = module_${file.name};`).join('\n')}
            `;

			return { contents, resolveDir: args.pluginData.resolveDir };
		});
	},
};

module.exports = wildcardImport;
