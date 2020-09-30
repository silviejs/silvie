import pluralize from 'pluralize';
import { snakeCase } from 'change-case';

import QueryBuilder from 'base/database/builders/query';

class Model {
	protected static tableName = '';

	protected static primaryKey: string | string[] = 'id';

	protected static useTimestamps = true;

	protected static createTimestamp = 'created_at';

	protected static updateTimestamp = 'updated_at';

	protected static useSoftDeletes = false;

	protected static softDeleteTimestamp = 'deleted_at';

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

	/**
	 * Configures a query builder to match this model table and configuration
	 */
	static get baseQueryBuilder(): QueryBuilder {
		return new QueryBuilder(this.table).extend({
			useTimestamps: this.useTimestamps,
			createTimestamp: this.createTimestamp,
			updateTimestamp: this.updateTimestamp,

			useSoftDeletes: this.useSoftDeletes,
			softDeleteTimestamp: this.softDeleteTimestamp,
		});
	}

	/**
	 * Configures a query builder to match with this model's primary key
	 * @param queryBuilder Query builder instance to add conditions to
	 * @param thisRef Uses the current instance properties to get primary key values
	 * @param ids ID or IDs to search for
	 */
	static primaryKeyCondition(queryBuilder: QueryBuilder, thisRef: Model, ids?: any | any[]): QueryBuilder {
		if (thisRef) {
			if (this.primaryKey instanceof Array) {
				this.primaryKey.forEach((key) => {
					queryBuilder.where(key, thisRef[key]);
				});
			} else {
				queryBuilder.where(this.primaryKey, thisRef[this.primaryKey]);
			}
		} else if (this.primaryKey instanceof Array) {
			if (ids instanceof Array) {
				ids.forEach((id, index) => {
					if (index === 0) {
						queryBuilder.where((cb) => {
							(this.primaryKey as string[]).forEach((key) => {
								cb.where(key, id);
							});
						});
					} else {
						queryBuilder.orWhere((cb) => {
							(this.primaryKey as string[]).forEach((key) => {
								cb.where(key, id);
							});
						});
					}
				});
			} else {
				this.primaryKey.forEach((key) => {
					queryBuilder.where(key, ids);
				});
			}
		} else if (ids instanceof Array) {
			queryBuilder.whereIn(this.primaryKey, ids);
		} else {
			queryBuilder.where(this.primaryKey, ids);
		}

		return queryBuilder;
	}

	/**
	 * Cast a RawDataPacket into the current model
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
		return this.cast(await this.primaryKeyCondition(this.baseQueryBuilder, null, id).first());
	}

	static async findAll(...ids: any[]): Promise<Model[]> {
		return this.castAll(await this.primaryKeyCondition(this.baseQueryBuilder, null, ids).get());
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
	static insert(data: any[]): Promise<[number, number]> {
		return this.baseQueryBuilder.insert(data);
	}

	/**
	 * Delete a record of this kind (uses soft delete if it is enabled in model)
	 * @param id
	 */
	static delete(id: any): Promise<number> {
		return this.primaryKeyCondition(this.baseQueryBuilder, null, id).delete(this.useSoftDeletes);
	}

	/**
	 * Delete all the records of this kind (uses soft delete if it is enabled in model)
	 * @param ids
	 */
	static deleteAll(...ids: any[]): Promise<number> {
		return this.primaryKeyCondition(this.baseQueryBuilder, null, ids).delete(this.useSoftDeletes);
	}

	/**
	 * Restore a soft deleted record of this kind
	 * @param id
	 */
	static restore(id: any): Promise<number> {
		return this.primaryKeyCondition(this.baseQueryBuilder, null, id).restore();
	}

	/**
	 * Restore soft deleted records of this kind
	 * @param ids
	 */
	static restoreAll(...ids: any[]): Promise<number> {
		return this.primaryKeyCondition(this.baseQueryBuilder, null, ids).delete(this.useSoftDeletes);
	}

	/**
	 * Delete a record of this kind
	 * @param id
	 */
	static forceDelete(id: any): Promise<number> {
		return this.primaryKeyCondition(this.baseQueryBuilder, null, id).delete();
	}

	/**
	 * Delete all the records of this kind
	 * @param ids
	 */
	static forceDeleteAll(...ids: any[]): Promise<number> {
		return this.primaryKeyCondition(this.baseQueryBuilder, null, ids).delete();
	}

	/**
	 * Include soft deleted records in the result
	 */
	static withTrashed(): QueryBuilder {
		if (this.useSoftDeletes) {
			return this.baseQueryBuilder.withTrashed();
		}

		throw new Error(`'${this.name}' model does not support soft deletes`);
	}

	/**
	 * Filter results to soft deleted records
	 */
	static onlyTrashed(): QueryBuilder {
		if (this.useSoftDeletes) {
			return this.baseQueryBuilder.onlyTrashed();
		}

		throw new Error(`'${this.name}' model does not support soft deletes`);
	}

	/**
	 * Get count of records of this model
	 */
	static count(): Promise<number> {
		return this.baseQueryBuilder.count();
	}

	/**
	 * Create a base query builder configured to reach the current instance matching record
	 */
	get baseQueryBuilder(): QueryBuilder {
		const BaseClass = this.constructor as typeof Model;
		return BaseClass.primaryKeyCondition(BaseClass.baseQueryBuilder, this);
	}

	/**
	 * Fill this instance with the provided data
	 * @param data
	 */
	fill(data: any): void {
		Object.keys(data).forEach((key) => {
			this[key] = data[key];
		});
	}

	/**
	 * Retrieve a fresh copy of this instance from the database
	 */
	async fresh(): Promise<Model> {
		return (this.constructor as typeof Model).cast(await this.baseQueryBuilder.first());
	}

	/**
	 * Refresh the current database instance from the database
	 */
	async refresh(): Promise<void> {
		const result = await this.baseQueryBuilder.first();
		Object.assign(this, result);
	}

	/**
	 * Update the current instance with the provided data
	 * @param data
	 * @param silent Weather to refresh the update timestamp or not
	 */
	async update(data: any, silent = false): Promise<number> {
		const result = await this.baseQueryBuilder.update(data, silent);

		if (result.affectedRows > 0) {
			this.fill(data);
		}

		return result;
	}

	/**
	 * Delete the current instance (uses soft delete if it is enabled in model)
	 */
	delete(): Promise<any> {
		return this.baseQueryBuilder.delete((this.constructor as typeof Model).useSoftDeletes);
	}

	/**
	 * Delete the current instance
	 */
	forceDelete(): Promise<number> {
		return this.baseQueryBuilder.delete();
	}

	/**
	 * Save the changes of current instance in the database
	 */
	save(): void {}
}

// TODO: implement proxy methods of query builder

export default Model;
