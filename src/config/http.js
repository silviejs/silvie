export default {
	HTTP2: false,
	port: 4000,

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

		text: {
			enabled: false,
			inflate: true,
			limit: '10mb',
			type: 'text/plain',
			defaultCharset: 'utf-8',
		},
		raw: {
			enabled: false,
			inflate: true,
			limit: '10mb',
			type: 'application/octet-stream',
		},
		json: {
			enabled: true,
			inflate: true,
			strict: true,
			limit: '10mb',
			type: 'application/json',
		},
		urlencoded: {
			enabled: true,
			inflate: true,
			extended: true,
			limit: '10mb',
			parameterLimit: 1000,
			type: 'application/x-www-form-urlencoded',
		},
	},

	cookie: {
		enabled: true,
		secret: 'F^7otgBO*T*7B&T%*(&t87bv2re775ev',
	},

	session: {
		enabled: true,
		secret: 'F^7otgBO*T*7B&T%*(&t87bv2re775ev',
		driver: 'file',
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
