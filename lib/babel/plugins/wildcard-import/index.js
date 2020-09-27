const fs = require('fs');
const path = require('path');

module.exports = (babel) => {
	const { types: t } = babel;

	return {
		visitor: {
			ImportDeclaration(code, state) {
				const { node } = code;
				const importSource = node.source.value;
				const currentFilename = state.file.opts.filename;

				// Get import absolute path
				const fullImportPath = path.resolve(path.dirname(currentFilename), importSource);

				// Check if it exists and it is a directory
				if (fs.existsSync(fullImportPath) && fs.lstatSync(fullImportPath).isDirectory()) {
					// TODO: glob pattern & recursive

					let files = fs.readdirSync(fullImportPath).reverse();
					if (
						state.opts.changeExtensions &&
						state.opts.changeExtensions.enabled &&
						Object.keys(state.opts.changeExtensions.extensions).length > 0
					) {
						files = files.map((file) => {
							let output = file;
							Object.keys(state.opts.changeExtensions.extensions).forEach((extension) => {
								output = output.replace(
									new RegExp(`.${extension}$`),
									`.${state.opts.changeExtensions.extensions[extension]}`
								);
							});
							return output;
						});
					}
					const hasIndexFiles = files.filter((filename) => /^index\.(ts|js)$/.test(filename)).length > 0;

					// Check if there is no index files and there are files to import
					if (!hasIndexFiles) {
						if (node.specifiers.length === 0) {
							files.forEach((file) => {
								code.insertAfter(t.importDeclaration([], t.stringLiteral(`${importSource}/${file}`)));
							});
						} else {
							node.specifiers.forEach((spec) => {
								const variableName = spec.local.name;

								if (t.isImportDefaultSpecifier(spec) || t.isImportNamespaceSpecifier(spec)) {
									code.insertBefore(
										t.variableDeclaration('const', [
											t.variableDeclarator(t.identifier(variableName), t.objectExpression([])),
										])
									);

									files.forEach((file) => {
										const id = code.scope.generateUidIdentifier('drimp');

										code.insertBefore(
											t.importDeclaration([t.importDefaultSpecifier(id)], t.stringLiteral(`${importSource}/${file}`))
										);

										code.insertBefore(
											t.expressionStatement(
												t.assignmentExpression(
													'=',
													t.memberExpression(t.identifier(variableName), t.stringLiteral(path.parse(file).name), true),
													id
												)
											)
										);
									});
								} else if (t.isImportSpecifier(spec)) {
									const filename = spec.imported.name;
									const matchingFile = files.find((file) => file.startsWith(`${filename}.`));

									if (matchingFile) {
										code.insertBefore(
											t.importDeclaration(
												[t.importDefaultSpecifier(t.identifier(variableName))],
												t.stringLiteral(`${importSource}/${matchingFile}`)
											)
										);
									} else {
										// TODO: Throw error file not found
									}
								}
							});
						}

						// Remove directory import
						code.remove();
					}
				}
			},
		},
	};
};
