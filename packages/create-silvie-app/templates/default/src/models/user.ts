import Model from 'silvie/database/model';

export default class User extends Model {
	declare id: number;

	declare name: string;

	declare username: string;

	declare email: string;

	declare password: string;

	declare created_at: string;

	declare updated_at: string;
}
