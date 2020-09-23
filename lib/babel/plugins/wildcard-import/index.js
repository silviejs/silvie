/* eslint-disable no-underscore-dangle */
const _fs = require('fs');
const _path = require('path');

module.exports = (babel) => {
	const { types: t } = babel;

	return {
		visitor: {
			ImportDeclaration(path, state) {
				const { node } = path;
				const importSource = node.source.value;
				const currentFilename = state.file.opts.filename;

				// Get import absolute path
				const fullImportPath = _path.resolve(_path.dirname(currentFilename), importSource);

				// Check if it exists and it is a directory
				if (_fs.existsSync(fullImportPath) && _fs.lstatSync(fullImportPath).isDirectory()) {
					// TODO: glob pattern & recursive

					let files = _fs.readdirSync(fullImportPath).reverse();
					if (state.opts.changeExtensions && Object.keys(state.opts.changeExtensions).length > 0) {
						files = files.map((file) => {
							let output = file;
							Object.keys(state.opts.changeExtensions).forEach((extension) => {
								output = output.replace(new RegExp(`.${extension}$`), `.${state.opts.changeExtensions[extension]}`);
							});
							return output;
						});
					}
					const hasIndexFiles = files.filter((filename) => /^index\.(ts|js)$/.test(filename)).length > 0;

					// Check if there is no index files and there are files to import
					if (!hasIndexFiles && files.length > 0) {
						if (node.specifiers.length === 0) {
							files.forEach((file) => {
								path.insertAfter(t.importDeclaration([], t.stringLiteral(_path.join(importSource, file))));
							});
						} else {
							node.specifiers.forEach((spec) => {
								const variableName = spec.local.name;

								if (t.isImportDefaultSpecifier(spec) || t.isImportNamespaceSpecifier(spec)) {
									path.insertBefore(
										t.variableDeclaration('const', [
											t.variableDeclarator(t.identifier(variableName), t.objectExpression([])),
										])
									);

									files.forEach((file) => {
										const id = path.scope.generateUidIdentifier('drimp');

										path.insertAfter(
											t.importDeclaration(
												[t.importDefaultSpecifier(id)],
												t.stringLiteral(_path.join(importSource, file))
											)
										);

										path.insertAfter(
											t.expressionStatement(
												t.assignmentExpression(
													'=',
													t.memberExpression(t.identifier(variableName), t.stringLiteral(_path.parse(file).name), true),
													id
												)
											)
										);
									});
								} else if (t.isImportSpecifier(spec)) {
									const filename = spec.imported.name;
									const matchingFile = files.find((file) => file.startsWith(`${filename}.`));

									if (matchingFile) {
										path.insertAfter(
											t.importDeclaration(
												[t.importDefaultSpecifier(t.identifier(variableName))],
												t.stringLiteral(_path.join(importSource, matchingFile))
											)
										);
									} else {
										// TODO: Throw error file not found
									}
								}
							});
						}

						// Remove directory import
						path.remove();
					}
				}
			},
		},
	};
};
