module.exports = {
	driver: 'jwt',

	jwt: {
		secret: '', // Defaults to APP_KEY
		blacklist: './tmp/blacklist',
	},
};
