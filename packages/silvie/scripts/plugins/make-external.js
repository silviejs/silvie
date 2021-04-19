const path = require('path');

module.exports = (options = {}) => {
	return {
		name: 'make-external',

		setup(build) {
			build.onResolve({ filter: /.*/ }, async (args) => {
				if (args.kind === 'import-statement') {
					console.log(args.path);

					return { path: args.path, external: true };
				}
			});
		},
	};
};
