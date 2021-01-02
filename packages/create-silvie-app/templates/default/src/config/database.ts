module.exports = {
	enabled: true,

	type: '', // Defaults to DB_TYPE
	host: '', // Defaults to DB_HOST
	port: '', // Defaults to DB_PORT

	database: '', // Defaults to DB_DATABASE
	username: '', // Defaults to DB_USERNAME
	password: '', // Defaults to DB_PASSWORD

	mysql: {
		connectionLimit: 10,
		dateStrings: true,
		multipleStatements: true,
	},
};
