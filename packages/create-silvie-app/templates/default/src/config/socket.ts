module.exports = {
	enabled: false,

	path: '/socket.io',

	connectTimeout: 45000,
	upgradeTimeout: 10000,
	pingTimeout: 5000,
	pingInterval: 25000,

	transports: ['polling', 'websocket'],

	allowUpgrades: true,
	perMessageDeflate: false,
	httpCompression: true,
	allowEIO3: false,

	cors: {
		origin: '*',
	},
	cookie: {},
};
