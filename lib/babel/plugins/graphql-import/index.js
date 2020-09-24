const fs = require('fs');
const path = require('path');
const gql = require('graphql-tag');

module.exports = (babel) => {
	const { types: t } = babel;

	return {
		visitor: {
			ImportDeclaration(code, state) {
				const { node } = code;
				const importSource = node.source.value;
				const currentFilename = state.file.opts.filename;

				if (/\.(gql|graphql)$/.test(importSource)) {
					// Get import absolute path
					const fullImportPath = path.resolve(path.dirname(currentFilename), importSource);

					// Check if it exists
					if (fs.existsSync(fullImportPath)) {
						const contents = fs.readFileSync(fullImportPath, { encoding: 'utf8' });

						code.replaceWith(
							t.variableDeclaration('const', [
								t.variableDeclarator(
									t.identifier(node.specifiers[0].local.name),
									t.identifier(
										JSON.stringify(gql`
											${contents}
										`)
									)
								),
							])
						);
					}
				}
			},
		},
	};
};
