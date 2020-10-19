import path from 'path';

process.silviePath = path.resolve(__dirname, '../../');

if (process.env.IS_SILVIE_CLI === '1') {
	process.rootPath = process.cwd();
} else {
	process.rootPath = path.resolve(
		require.main.filename || __filename,
		`${process.env.NODE_ENV === 'development' ? '../' : ''}${process.relativeRootPath || '../'}../`
	);
}
