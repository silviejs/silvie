import User from 'models/user';

export default {
	Query: {
		user({ id }): Promise<User> {
			return User.find(id) as Promise<User>;
		},
		users(): Promise<User[]> {
			return User.all() as Promise<User[]>;
		},
	},
};
