/* eslint-disable no-underscore-dangle */

function nestedMapper(source, callback, destination = {}) {
	Object.keys(source).forEach((key) => {
		if (key !== '__import_depth') {
			if (source[key].__import_depth !== undefined) {
				destination[key] = {};
				nestedMapper(source[key], callback, destination[key]);
			} else {
				destination[key] = callback(source[key], key);
			}
		}
	});

	return destination;
}

function mapImports(imports, callback: CallableFunction) {
	return nestedMapper(imports, callback);
}

export default mapImports;
