import mysql from 'mysql';
import IDatabaseDriver from 'base/database/driver';
import Table from 'base/database/table';
import Column from 'base/database/column';
import QueryBuilder from 'base/database/builders/query';
import { ICondition, TBaseValue } from 'base/database/builders/condition';

interface MySQLOptions {
	host: string;
	port: number;
	database: string;
	username: string;
	password: string;
	connectionLimit?: number;
	dateStrings?: boolean;
	multipleStatements?: boolean;
}

export const MySQLTypes = {
	TinyInteger: 'TINYINT',
	SmallInteger: 'SMALLINT',
	MediumInteger: 'MEDIUMINT',
	Integer: 'INT',
	BigInteger: 'BIGINT',
	Bit: 'BIT',
	Boolean: 'TINYINT(1)',
	Decimal: 'DECIMAL()',
	Float: 'FLOAT',
	Double: 'DOUBLE',
	Year: 'YEAR',
	Date: 'DATE',
	Time: 'TIME',
	DateTime: 'DATETIME',
	Timestamp: 'TIMESTAMP',
	Character: 'CHAR',
	String: 'VARCHAR',
	Binary: 'BINARY',
	TinyBlob: 'TINYBLOB',
	Blob: 'BLOB',
	MediumBlob: 'MEDIUMBLOB',
	LongBlob: 'LONGBLOB',
	TinyText: 'TINYTEXT',
	Text: 'TEXT',
	MediumText: 'MEDIUMTEXT',
	LongText: 'LONGTEXT',
	Enum: 'ENUM',
	Set: 'SET',
	Geometry: 'GEOMETRY',
	Point: 'POINT',
	LineString: 'LINESTRING',
	Polygon: 'POLYGON',
	GeometryCollection: 'GEOMETRYCOLLECTION',
	MultiPoint: 'MULTIPOINT',
	MultiLineString: 'MULTILINESTRING',
	MultiPolygon: 'MULTIPOLYGON',
	JSON: 'JSON',
};

export default class MySQLDriver implements IDatabaseDriver {
	private pool: any;

	constructor(config: MySQLOptions) {
		this.pool = mysql.createPool({
			host: config.host,
			port: config.port,

			database: config.database,
			user: config.username,
			password: config.password,

			connectionLimit: config.connectionLimit || 10,
			dateStrings: config.dateStrings || true,
			multipleStatements: config.multipleStatements || false,
		});
	}

	private static resolveType(typeName: string): string {
		return MySQLTypes[typeName];
	}

	private static prepareTable(tableName: string): string {
		return `\`${tableName.replace(/['"`]/, '')}\``;
	}

	private static prepareColumn(columnName: string, tableName?: string): string {
		const cleanColumnName = columnName.replace(/['"`]/, '');

		const columnParts = cleanColumnName.split('.');

		if (tableName && columnParts.length === 1) {
			const cleanTableName = tableName.replace(/['"`]/, '');

			columnParts.splice(0, -1, cleanTableName);
		}

		return columnParts.map((part) => `\`${part}\``).join('.');
	}

	private static compileColumn(column: Column): [string, TBaseValue[]] {
		const queryParts = [];
		const params = [];

		queryParts.push(`\`${column.name}\``);

		const type = this.resolveType(column.type);
		if (column.size) {
			queryParts.push(`${type}(${column.size})`);
		} else {
			queryParts.push(type);
		}

		if (type.endsWith('INT') && column.options.unsigned) queryParts.push('UNSIGNED');

		if (column.options.defaultValue !== undefined) {
			if (column.options.defaultValue === null) {
				queryParts.push(`DEFAULT NULL`);
			} else {
				queryParts.push(`DEFAULT ?`);
				params.push(column.options.defaultValue);
			}
		} else if (column.options.useCurrent) {
			if (column.type === 'Date') {
				queryParts.push(`DEFAULT CURRENT_DATE`);
			} else if (column.type === 'Time') {
				queryParts.push(`DEFAULT CURRENT_TIME`);
			} else if (column.type === 'Timestamp' || column.type === 'DateTime') {
				queryParts.push(`DEFAULT CURRENT_TIMESTAMP`);
			}
		}

		if (column.options.nullable) queryParts.push('NULL');
		else queryParts.push('NOT NULL');

		if (column.options.autoIncrement) queryParts.push('AUTO_INCREMENT');
		if (column.options.charset) queryParts.push(`CHARACTER SET ${column.options.charset}`);
		if (column.options.collation) queryParts.push(`COLLATE ${column.options.collation}`);

		return [queryParts.join(' '), params];
	}

	private static compileCreateTable(table: Table): [string, TBaseValue[]] {
		const { indices, fullTextIndices, spatialIndices, primaries, uniques } = table.getConstraints();

		const params = [];
		let query = `CREATE TABLE ${table.name} (`;

		query += table.columns
			.map((column) => {
				const [q, p] = this.compileColumn(column);

				params.push(...p);
				return q;
			})
			.join(', ');

		if (primaries.length > 0) {
			query += `, PRIMARY KEY (${primaries.map((column) => `\`${column.name}\``).join(', ')})`;
		}

		if (uniques.length > 0) {
			query += `, UNIQUE (${uniques.map((column) => `\`${column.name}\``).join(', ')})`;
		}

		if (indices.length > 0) {
			query += `, ${indices.map((column) => `INDEX (\`${column.name}\`)`).join(', ')}`;
		}

		if (fullTextIndices.length > 0) {
			query += `, ${fullTextIndices.map((column) => `FULLTEXT (\`${column.name}\`)`).join(', ')}`;
		}

		if (spatialIndices.length > 0) {
			query += `, ${spatialIndices.map((column) => `SPATIAL (\`${column.name}\`)`).join(', ')}`;
		}

		if (table.relations.length > 0) {
			query += `, ${table.relations
				.map(
					(relation) =>
						`FOREIGN KEY (\`${relation.foreignKey}\`) REFERENCES ${relation.table}(\`${relation.primaryKey}\`)`
				)
				.join(', ')}`;
		}

		query += ');';

		return [query, params];
	}

	createTable(table: Table): Promise<any> {
		return this.execute(...MySQLDriver.compileCreateTable(table));
	}

	truncateTable(tableName: string): Promise<any> {
		return this.execute(`TRUNCATE TABLE \`${tableName}\`;`);
	}

	dropTableIfExists(tableName: string): Promise<any> {
		return this.execute(`DROP TABLE IF EXISTS \`${tableName}\`;`);
	}

	dropTable(tableName: string): Promise<any> {
		return this.execute(`DROP TABLE \`${tableName}\`;`);
	}

	private static compileConditions(conditions: ICondition[], tableName?: string): [string, TBaseValue[]] {
		const params = [];
		const query = conditions
			.map((condition, index) => {
				const relation = index === 0 ? '' : { and: 'AND', or: 'OR' }[condition.relation];
				let clause = index === 0 ? '' : `${relation} `;

				if (condition.type === 'raw') {
					params.push(...condition.params);
					return condition.query;
				}

				if (condition.type === 'group') {
					const [q, p] = this.compileConditions(condition.conditions, tableName);
					params.push(...p);
					clause += `(${q})`;

					return clause;
				}

				if (condition.type === 'column') {
					clause += `${this.prepareColumn(condition.leftHandSide as string, tableName)} ${
						condition.operator
					} ${this.prepareColumn(condition.rightHandSide as string, tableName)}`;

					return clause;
				}

				let lhs = '';
				if (condition.leftHandSide instanceof QueryBuilder) {
					const [q, p] = this.compileSelect(condition.leftHandSide);
					params.push(...p);
					lhs = `(${q})`;
				} else {
					lhs = this.prepareColumn(condition.leftHandSide as string, tableName);
				}

				let rhs: any = '';
				if (condition.rightHandSide instanceof QueryBuilder) {
					const [q, p] = this.compileSelect(condition.rightHandSide);
					params.push(...p);
					rhs = `(${q})`;
				} else {
					rhs = condition.rightHandSide;
				}

				if (condition.type === 'value') {
					params.push(rhs);
					clause += `${lhs} ${condition.operator} ?`;
				}

				if (condition.type === 'null' || condition.type === 'not null') {
					clause += `${lhs} ${condition.type.startsWith('not') ? 'IS NOT' : 'IS'} NULL`;
				}

				if (condition.type === 'between' || condition.type === 'not between') {
					params.push(...(rhs as [TBaseValue, TBaseValue]));
					clause += `${lhs} ${condition.type.startsWith('not') ? 'NOT BETWEEN' : 'BETWEEN'} ? AND ?`;
				}

				if (condition.type === 'like' || condition.type === 'not like') {
					params.push(rhs);
					clause += `${lhs} ${condition.type.startsWith('not') ? 'NOT LIKE' : 'LIKE'} ?`;
				}

				if (condition.type === 'in' || condition.type === 'not in') {
					params.push(...(rhs as TBaseValue[]));
					clause += `${lhs} ${condition.type.startsWith('not') ? 'NOT IN' : 'IN'} (${new Array(
						(rhs as TBaseValue[]).length
					)
						.fill('?')
						.join(', ')})`;
				}

				if (
					condition.type === 'date' ||
					condition.type === 'year' ||
					condition.type === 'month' ||
					condition.type === 'day' ||
					condition.type === 'time'
				) {
					params.push(condition.rightHandSide);
					clause += `${condition.type.toUpperCase()}(${lhs}) ${condition.operator} ?`;
				}

				return clause;
			})
			.join(' ');

		return [query, params];
	}

	private static compileSelectFields(qb: QueryBuilder): [string, TBaseValue[]] {
		const fields = qb.options.select;

		if (fields.length === 0) {
			return ['*', []];
		}

		const params = [];
		const query = fields
			.map((field) => {
				if (field.type === 'column') {
					return this.prepareColumn(field.column, qb.options.table);
				}

				if (field.type === 'query') {
					const [q, p] = this.compileSelect(field.queryBuilder);

					params.push(...p);
					return `(${q})${field.alias ? ` AS \`${field.alias}\`` : ''}`;
				}

				if (field.type === 'raw') {
					params.push(...field.params);
					return field.query;
				}

				throw new Error(`Invalid select field`);
			})
			.join(', ');

		return [query, params];
	}

	private static compileJoin(qb: QueryBuilder): [string, TBaseValue[]] {
		const joins = qb.options.join;

		if (joins.length === 0) {
			return ['', []];
		}

		const params = [];
		const query = joins
			.map((join) => {
				const type = {
					inner: 'INNER JOIN',
					left: 'LEFT JOIN',
					right: 'RIGHT JOIN',
					outer: 'OUTER JOIN',
					cross: 'CROSS JOIN',
				}[join.type];

				let table = '';
				if (join.queryBuilder) {
					const [q, p] = this.compileSelect(join.queryBuilder);
					params.push(...p);

					table = `(${q}) \`${join.alias}\``;
				} else {
					table = `${this.prepareTable(join.table)}${join.alias ? ` \`${join.alias}\`` : ''}`;
				}

				let conditions = '';
				if (join.conditions) {
					const [q, p] = this.compileConditions(join.conditions, qb.options.table);
					params.push(...p);

					conditions = q;
				} else {
					conditions = `${this.prepareColumn(join.column1, qb.options.table)} ${join.operator} ${this.prepareColumn(
						join.column2,
						qb.options.table
					)}`;
				}

				return `${type} ${table} ON ${conditions}`;
			})
			.join(' ');

		return [query, params];
	}

	private static compileUnion(qb: QueryBuilder): [string, TBaseValue[]] {
		const unions = qb.options.union;

		if (unions.length === 0) {
			return ['', []];
		}

		const params = [];
		const query = unions
			.map((union) => {
				if (union.type === 'raw') {
					params.push(...union.params);
					return `UNION${union.all ? ' ALL' : ''} ${union.query}`;
				}

				if (union.type === 'query') {
					const [q, p] = this.compileSelect(union.queryBuilder);

					params.push(...p);
					return `UNION${union.all ? ' ALL' : ''} ${q}`;
				}

				throw new Error(`Invalid select field`);
			})
			.join(' ');

		return [query, params];
	}

	private static compileOrder(qb: QueryBuilder): [string, TBaseValue[]] {
		const orders = qb.options.order;

		if (orders.length === 0) {
			return ['', []];
		}

		const params = [];
		const query = `ORDER BY ${orders
			.map((order) => {
				if (order.type === 'column') {
					return `${this.prepareColumn(order.column, qb.options.table)} ${order.direction || 'ASC'}`;
				}

				if (order.type === 'query') {
					const [q, p] = this.compileSelect(order.queryBuilder);
					params.push(...p);

					return `(${q})`;
				}

				if (order.type === 'raw') {
					params.push(...order.params);
					return order.query;
				}

				return '';
			})
			.join(', ')}`;

		return [query, params];
	}

	private static compileGroup(qb: QueryBuilder): [string, TBaseValue[]] {
		const groups = qb.options.group;
		const havingConditions = qb.options.having;

		if (groups.length === 0) {
			return ['', []];
		}

		const params = [];
		let query = `GROUP BY ${groups
			.map((group) => {
				if (group.type === 'column') {
					return this.prepareColumn(group.column, qb.options.table);
				}

				if (group.type === 'raw') {
					params.push(...group.params);
					return group.query;
				}

				return '';
			})
			.join(', ')}`;

		if (havingConditions.length > 0) {
			const [q, p] = this.compileConditions(havingConditions, qb.options.table);

			params.push(...p);
			query += ` HAVING ${q}`;
		}

		return [query, params];
	}

	private static compileWhere(qb: QueryBuilder): [string, TBaseValue[]] {
		const whereConditions = qb.options.where;

		if (whereConditions.length === 0) {
			return ['', []];
		}

		const [q, p] = this.compileConditions(whereConditions, qb.options.table);

		return [`WHERE ${q}`, p];
	}

	private static compileLimit(qb): [string, TBaseValue[]] {
		const { limit, offset } = qb.options;

		if (!limit) {
			if (!offset) {
				return ['', []];
			}

			return [`Limit ?,?`, [offset, 18446744073709551615]];
		}

		if (offset) {
			return [`Limit ?,?`, [offset, limit]];
		}

		return [`Limit ?`, [limit]];
	}

	private static compileSelect(qb: QueryBuilder): [string, TBaseValue[]] {
		const [fieldsQuery, fieldsParams] = this.compileSelectFields(qb);
		const [whereQuery, whereParams] = this.compileWhere(qb);
		const [groupQuery, groupParams] = this.compileGroup(qb);
		const [orderQuery, orderParams] = this.compileOrder(qb);
		const [limitQuery, limitParams] = this.compileLimit(qb);
		const [unionQuery, unionParams] = this.compileUnion(qb);
		const [joinQuery, joinParams] = this.compileJoin(qb);

		const params = [
			...fieldsParams,
			...whereParams,
			...groupParams,
			...orderParams,
			...limitParams,
			...unionParams,
			...joinParams,
		];

		let query = `SELECT ${fieldsQuery} `;
		if (qb.options.selectInto) query += `INTO ${qb.options.selectInto} `;
		query += `FROM ${this.prepareTable(qb.options.table)} `;
		query += [joinQuery, whereQuery, groupQuery, orderQuery, limitQuery, unionQuery].filter((q) => q !== '').join(' ');

		return [query, params];
	}

	select(queryBuilder: QueryBuilder): Promise<any> {
		return this.execute(...MySQLDriver.compileSelect(queryBuilder));
	}

	async exists(queryBuilder: QueryBuilder): Promise<boolean> {
		const [query, params] = MySQLDriver.compileSelect(queryBuilder);

		const [result] = await this.execute(`SELECT EXISTS(${query}) AS \`exists\``, params);

		return !!result.exists;
	}

	private static compileInsert(qb: QueryBuilder): [string, TBaseValue[]] {
		const params = [];
		let query = `INSERT INTO ${this.prepareTable(qb.options.table)}`;

		const fieldNames = Object.keys(qb.options.insert[0]);
		query += `(${fieldNames.map(this.prepareColumn).join(', ')}) VALUES `;

		const values = qb.options.insert.map((dataset) => {
			fieldNames.forEach((fieldName) => {
				params.push(dataset[fieldName]);
			});

			return `(${new Array(fieldNames.length).fill('?').join(', ')})`;
		});

		query += `${values.join(', ')}`;

		return [query, params];
	}

	insert(queryBuilder: QueryBuilder): Promise<any> {
		return this.execute(...MySQLDriver.compileInsert(queryBuilder));
	}

	insertOrIgnore(queryBuilder: QueryBuilder): Promise<any> {
		const query = '';
		const params = [];

		return this.execute(query, params);
	}

	update(queryBuilder: QueryBuilder): Promise<any> {
		const query = '';
		const params = [];

		return this.execute(query, params);
	}

	bulkUpdate(queryBuilder: QueryBuilder): Promise<any> {
		const query = '';
		const params = [];

		return this.execute(query, params);
	}

	private static compileDelete(qb: QueryBuilder): [string, TBaseValue[]] {
		const [whereQuery, whereParams] = this.compileWhere(qb);
		const [orderQuery, orderParams] = this.compileOrder(qb);
		const [limitQuery, limitParams] = this.compileLimit(qb);

		const params = [...whereParams, ...orderParams, ...limitParams];

		let query = `DELETE FROM ${this.prepareTable(qb.options.table)} `;
		query += [whereQuery, orderQuery, limitQuery].filter((q) => q !== '').join(' ');

		return [query, params];
	}

	delete(queryBuilder: QueryBuilder): Promise<any> {
		return this.execute(...MySQLDriver.compileDelete(queryBuilder));
	}

	private static compileSoftDelete(qb: QueryBuilder): [string, TBaseValue[]] {
		const [whereQuery, whereParams] = this.compileWhere(qb);
		const [orderQuery, orderParams] = this.compileOrder(qb);
		const [limitQuery, limitParams] = this.compileLimit(qb);

		const params = [...whereParams, ...orderParams, ...limitParams];

		let query = `UPDATE ${this.prepareTable(qb.options.table)} SET \`deleted_at\` = CURRENT_TIMESTAMP `;
		query += [whereQuery, orderQuery, limitQuery].filter((q) => q !== '').join(' ');

		return [query, params];
	}

	softDelete(queryBuilder: QueryBuilder): Promise<any> {
		return this.execute(...MySQLDriver.compileSoftDelete(queryBuilder));
	}

	private static compileUndelete(qb: QueryBuilder): [string, TBaseValue[]] {
		const [whereQuery, whereParams] = this.compileWhere(qb);
		const [orderQuery, orderParams] = this.compileOrder(qb);
		const [limitQuery, limitParams] = this.compileLimit(qb);

		const params = [...whereParams, ...orderParams, ...limitParams];

		let query = `UPDATE ${this.prepareTable(qb.options.table)} SET \`deleted_at\` = NULL `;
		query += [whereQuery, orderQuery, limitQuery].filter((q) => q !== '').join(' ');

		return [query, params];
	}

	undelete(queryBuilder: QueryBuilder): Promise<any> {
		return this.execute(...MySQLDriver.compileUndelete(queryBuilder));
	}

	execute(query: string, params: TBaseValue[] = []): Promise<any> {
		return new Promise((resolve, reject) => {
			this.pool.query(query, params, (error, result) => {
				if (error) return reject(error);

				return resolve(result);
			});
		});
	}

	closeConnection(): void {
		this.pool.end();
	}
}
