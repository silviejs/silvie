/* eslint-disable no-underscore-dangle */

function flattenImports(imports) {
	const output = [];

	Object.keys(imports).forEach((moduleName) => {
		if (moduleName !== '__import_depth') {
			if (imports[moduleName].__import_depth !== undefined) {
				output.push(...(flattenImports(imports[moduleName]) as any[]));
			} else {
				output.push(imports[moduleName]);
			}
		}
	});

	return output;
}

export default flattenImports;
