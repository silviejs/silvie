import ModelQueryBuilder from 'base/database/model/query_builder';

class Model extends ModelQueryBuilder {
	/**
	 * Fetch all records from the table
	 */
	static async all(): Promise<Model[]> {
		return this.castAll(await this.baseQueryBuilder.get()) as Model[];
	}

	/**
	 * Find a record in the table with the given id
	 * @param id
	 */
	static async find(id: any): Promise<Model> {
		return this.cast(await this.primaryKeyCondition(this.baseQueryBuilder, null, id).first()) as Model;
	}

	static async findAll(...ids: any[]): Promise<Model[]> {
		return this.castAll(await this.primaryKeyCondition(this.baseQueryBuilder, null, ids).get()) as Model[];
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
		return (this.constructor as typeof Model).cast(await this.baseQueryBuilder.first()) as Model;
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
	save(): Promise<number> {
		return this.update(this);
	}
}

export default Model;
