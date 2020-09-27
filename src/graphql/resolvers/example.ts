export default {
	Example: {
		exponential(self, params, { loaders }) {
			return loaders.example.load(self.id);
		},
	},
	Query: {
		getExample(): any {
			return {
				id: Math.floor(Math.random() * 9000 + 1000),
				name: 'I am the example query',
			};
		},
	},
};
