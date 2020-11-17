import User from 'models/user';

class UserResolver {
	static user(obj, { id }): Promise<User> {
		return User.find(id) as Promise<User>;
	}

	static users(): Promise<User[]> {
		return User.all() as Promise<User[]>;
	}
}

export default {
	Query: {
		user: UserResolver.user,
		users: UserResolver.users,
	},
};
