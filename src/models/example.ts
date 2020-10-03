import Model from 'base/database/model';

export default class Example extends Model {
	protected static useSoftDeletes = true;

	declare id: number;

	declare name: string;
}
