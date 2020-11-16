module.exports = {
	HTTP2: false,
	port: 4000,
	trustProxy: true,

	statics: [
		{
			path: './assets',
			alias: null,
			options: {
				acceptRanges: true,
				cacheControl: true,
				dotfiles: 'ignore',
				etag: true,
				extensions: false,
				immutable: false,
				index: false,
				lastModified: true,
				maxAge: 0,
				redirect: true,
			},
		},
	],

	body: {
		enabled: true,

		parsers: [
			{
				type: 'text',
				inflate: true,
				limit: '10mb',
				mime: 'text/plain',

				options: {
					defaultCharset: 'utf-8',
				},
			},
			{
				type: 'raw',
				inflate: true,
				limit: '10mb',
				mime: 'application/octet-stream',
			},
			{
				type: 'json',
				inflate: true,
				limit: '10mb',
				mime: 'application/json',

				options: {
					strict: false,
				},
			},
			{
				type: 'urlencoded',
				inflate: true,
				limit: '10mb',
				mime: 'application/x-www-form-urlencoded',

				options: {
					extended: true,
					parameterLimit: 1000,
				},
			},
		],
	},

	cookie: {
		enabled: true,
		secret: '', // Defaults to APP_KEY
	},

	session: {
		enabled: true,
		secret: '', // Defaults to APP_KEY
		reSave: false,
		saveUninitialized: false,
		unset: 'destroy',
		trustProxy: true,

		driver: 'file',
		driverOptions: {
			file: {
				path: './session',
				extension: '.json',
				ttl: 86400,
			},
			redis: {
				host: '', // Defaults to REDIS_HOST
				port: '', // Defaults to REDIS_PORT
				password: '', // Defaults to REDIS_PASSWORD
				ttl: 86400,
				prefix: 'sess:',
			},
		},
		cookie: {
			name: 'sid',
			path: '/',
			httpOnly: true,
			maxAge: 86400000, // 1 day in milliseconds
			sameSite: true,
			secure: true,
		},
	},

	ssl: {
		enabled: false,
		certFile: '',
		keyFile: '',
		passphrase: '',
	},

	uploads: {
		enabled: true,
		tempDirectory: './tmp',
		maxFileSize: 10485760, // 10 MB
	},

	cors: {
		enabled: true,
		originsAllowed: ['*'],
		methodsAllowed: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
		headersAllowed: null,
		headersExposed: null,
		allowCredentials: true,
		optionsSuccessStatus: 200,
		maxAge: null,
		continuePreflight: false,
	},
};
