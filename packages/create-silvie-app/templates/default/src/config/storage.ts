module.exports = {
	path: './storage',

	disks: {
		default: 'default',
	},

	files: {
		hash: {
			algorithm: 'sha256',
			salt: '', // Defaults to APP_KEY
		},
	},
};
