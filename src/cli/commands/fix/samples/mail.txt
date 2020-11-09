module.exports = {
	enabled: false,

	host: 'example.com',
	port: '465',

	secure: true,
	rejectUnauthorized: false,

	accounts: {
		'test@example.com': {
			username: 'test@example.com',
			password: '',
		},
	},
};
