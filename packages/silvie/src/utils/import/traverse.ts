/* eslint-disable no-underscore-dangle */

function traverseImports(imports, callback: CallableFunction) {
	Object.keys(imports).forEach((moduleName) => {
		if (moduleName !== '__import_depth') {
			if (imports[moduleName].__import_depth !== undefined) {
				traverseImports(imports[moduleName], callback);
			} else {
				callback(imports[moduleName], moduleName);
			}
		}
	});
}

export default traverseImports;
