export default {
	Query: {
		getExample(): any {
			return {
				id: Math.floor(Math.random() * 9000 + 1000),
				name: 'I am the example query',
			};
		},
	},
};
