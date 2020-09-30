import pluralize from 'pluralize';
import { snakeCase } from 'change-case';

import QueryBuilder from 'base/database/builders/query';

export default class Model {
	protected static tableName = '';

	protected static primaryKey = 'id';

	protected static createTimeStamp = 'created_at';

	protected static updateTimeStamp = 'updated_at';

	protected static useSoftDeletes = false;

	protected static softDeleteTimeStamp = 'deleted_at';

	/**
	 * Create a new instance of this model from a initial data object
	 * @param initialData
	 */
	constructor(initialData: any) {
		Object.keys(initialData).forEach((key) => {
			this[key] = initialData[key];
		});
	}

	/**
	 * The table name for this model
	 */
	static get table() {
		if (!this.tableName) {
			this.tableName = snakeCase(pluralize(this.name));
		}

		return this.tableName;
	}

	static get baseQueryBuilder(): QueryBuilder {
		return new QueryBuilder(this.table).extend({
			createTimeStamp: this.createTimeStamp,
			updateTimeStamp: this.updateTimeStamp,
			useSoftDeletes: this.useSoftDeletes,
			softDeleteTimeStamp: this.softDeleteTimeStamp,
		});
	}

	/**
	 * Cast a RawDataPackets into the current model
	 * @param data
	 * @private
	 */
	private static cast(data: any): Model {
		return new this(data);
	}

	/**
	 * Cast an array of RawDataPackets into the current model
	 * @param data
	 * @private
	 */
	private static castAll(data: any[]): Model[] {
		return data.map((row) => this.cast(row));
	}

	/**
	 * Fetch all records from the table
	 */
	static async all(): Promise<Model[]> {
		return this.castAll(await this.baseQueryBuilder.get());
	}

	/**
	 * Find a record in the table with the given id
	 * @param id
	 */
	static async find(id: any): Promise<Model> {
		return this.cast(await this.baseQueryBuilder.where(this.primaryKey, id).first());
	}

	/**
	 * Insert a single record into the table and return with either created record or InsertedId
	 * @param data
	 * @param shouldReturn Specify to return the created record or not, defaults to true
	 */
	static async create(data: any, shouldReturn = true): Promise<Model> {
		const result = await this.baseQueryBuilder.insert([data]);

		if (shouldReturn) {
			return this.find(result.insertId);
		}

		return result.insertId;
	}

	/**
	 * Insert a data array into the table and return with [LastInsertId, AffectedRows]
	 * @param data
	 */
	static async insert(data: any[]): Promise<[number, number]> {
		const result = await this.baseQueryBuilder.insert(data);

		return [result.insertId, result.affectedRows];
	}
}
