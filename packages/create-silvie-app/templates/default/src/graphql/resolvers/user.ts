import User from 'models/user';

export default {
	Query: {
		user({ id }): User {
			return User.find(id);
		},
		users(): User[] {
			return User.all();
		},
	},
};
