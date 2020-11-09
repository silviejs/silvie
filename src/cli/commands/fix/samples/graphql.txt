module.exports = {
	enabled: true,

	path: '/graphql',
	middleware: '',

	playground: process.env.NODE_ENV === 'development',
	introspection: true,

	allowJSON: true,

	allowUpload: true,
	maxFiles: 10,
	maxFileSize: 10485760, // 10 MB
};
