import ModelQueryBuilder, { IModel } from 'src/database/model/query_builder';
import { TBaseValue } from 'src/database/builders/condition';

class Model extends ModelQueryBuilder implements IModel {
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
	static async find(id: TBaseValue | TBaseValue[]): Promise<Model> {
		const result = await this.primaryKeyCondition(this.baseQueryBuilder, null, id).first();

		return result ? (this.cast(result) as Model) : null;
	}

	static async findAll(...ids: (TBaseValue | TBaseValue[])[]): Promise<Model[]> {
		const results = await this.primaryKeyCondition(this.baseQueryBuilder, null, ids).get();

		return results.length > 0 ? (this.castAll(results) as Model[]) : [];
	}

	/**
	 * Insert a single record into the table and return with either created record or InsertedId
	 * @param data
	 * @param shouldReturn Specify to return the created record or not, defaults to true
	 */
	static async create(data: any, shouldReturn = true): Promise<Model> {
		const [insertId] = await this.baseQueryBuilder.insert([data]);

		if (shouldReturn) {
			return this.find(insertId);
		}

		return insertId;
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
