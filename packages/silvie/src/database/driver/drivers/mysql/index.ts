import mysql from 'mysql2';
import IDatabaseDriver, { IInsertionResult, IModificationResult } from 'src/database/driver';
import Table from 'src/database/migration/table';
import Column from 'src/database/migration/column';
import QueryBuilder from 'src/database/builders/query';
import { ICondition, TBaseValue, TColumn } from 'src/database/builders/condition';
import SpatialData from 'src/database/driver/drivers/mysql/datatypes/spatial';

interface MySQLOptions {
	host: string;
	port: number;
	database: string;
	username: string;
	password: string;
	connectionLimit?: number;
	dateStrings?: boolean;
	multipleStatements?: boolean;
	charset?: string;
}

export const MySQLTypes = {
	TinyInteger: 'TINYINT',
	SmallInteger: 'SMALLINT',
	MediumInteger: 'MEDIUMINT',
	Integer: 'INT',
	BigInteger: 'BIGINT',
	Bit: 'BIT',
	Boolean: 'TINYINT(1)',
	Decimal: 'DECIMAL',
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

export const ReverseMySQLTypes = {
	tinyint: 'TinyInteger',
	smallint: 'SmallInteger',
	mediumint: 'MediumInteger',
	int: 'Integer',
	bigint: 'BigInteger',
	bit: 'Bit',
	boolean: 'Boolean',
	decimal: 'Decimal',
	float: 'Float',
	double: 'Double',
	year: 'Year',
	date: 'Date',
	time: 'Time',
	datetime: 'DateTime',
	timestamp: 'Timestamp',
	char: 'Character',
	varchar: 'String',
	binary: 'Binary',
	tinyblob: 'TinyBlob',
	blob: 'Blob',
	mediumblob: 'MediumBlob',
	longblob: 'LongBlob',
	tinytext: 'TinyText',
	text: 'Text',
	mediumtext: 'MediumText',
	longtext: 'LongText',
	enum: 'Enum',
	set: 'Set',
	geometry: 'Geometry',
	point: 'Point',
	linestring: 'LineString',
	polygon: 'Polygon',
	geometrycollection: 'GeometryCollection',
	multipoint: 'MultiPoint',
	multilinestring: 'MultiLineString',
	multipolygon: 'MultiPolygon',
	json: 'JSON',
};

export default class MySQLDriver implements IDatabaseDriver {
	private pool: any;

	constructor(config: MySQLOptions, instanceCallback?: any) {
		let pool = mysql.createPool({
			host: config.host,
			port: config.port,

			database: config.database,
			user: config.username,
			password: config.password,

			connectionLimit: config.connectionLimit || 10,
			dateStrings: config.dateStrings || true,
			multipleStatements: config.multipleStatements || false,
			charset: config.charset || 'utf8',
		});

		if (instanceCallback instanceof Function) {
			pool = instanceCallback("mysql", pool)
		}

		this.pool = pool;
	}

	private static resolveType(typeName: string): string {
		return MySQLTypes[typeName];
	}

	private static tbl(tableName: string): string {
		return `\`${tableName.replace(/['"`]/, '')}\``;
	}

	private static col(columnName: string, tableName?: string): string {
		const cleanColumnName = columnName.replace(/['"`]/, '');

		const columnParts = cleanColumnName.split('.');

		if (tableName && columnParts.length === 1) {
			const cleanTableName = tableName.replace(/['"`]/, '');

			columnParts.splice(0, -1, cleanTableName);
		}

		return columnParts.map((part) => (part !== '*' ? `\`${part}\`` : '*')).join('.');
	}

	private static compileColumn(column: Column): [string, TBaseValue[]] {
		const queryParts = [];
		const params = [];

		queryParts.push(this.col(column.name));

		const type = this.resolveType(column.type);
		if (column.size) {
			queryParts.push(`${type}(${column.size})`);
		} else if (column.type === 'Enum' || column.type === 'Set') {
			queryParts.push(`${type}(${column.options.meta.values.map((val) => `"${val}"`).join(', ')})`);
		} else if (column.type === 'Decimal') {
			queryParts.push(`${type}(${column.options.meta.percision},${column.options.meta.scale})`);
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
			query += `, PRIMARY KEY (${primaries.map((column) => this.col(column.name)).join(', ')})`;
		}

		if (uniques.length > 0) {
			query += `, UNIQUE (${uniques.map((column) => this.col(column.name)).join(', ')})`;
		}

		if (indices.length > 0) {
			query += `, ${indices.map((column) => `INDEX (${this.col(column.name)})`).join(', ')}`;
		}

		if (fullTextIndices.length > 0) {
			query += `, ${fullTextIndices.map((column) => `FULLTEXT (${this.col(column.name)})`).join(', ')}`;
		}

		if (spatialIndices.length > 0) {
			query += `, ${spatialIndices.map((column) => `SPATIAL (${this.col(column.name)})`).join(', ')}`;
		}

		if (table.relations.length > 0) {
			query += `, ${table.relations
				.map(
					(relation) =>
						`FOREIGN KEY (${this.col(relation.foreignKey)}) REFERENCES ${this.col(relation.table)}(${this.col(
							relation.primaryKey
						)})`
				)
				.join(', ')}`;
		}

		query += ');';

		return [query, params];
	}

	createTable(table: Table): Promise<any> {
		return this.execute(...MySQLDriver.compileCreateTable(table));
	}

	async fetchTable(tableName: string): Promise<Table> {
		const table = new Table(tableName);
		const [{ 'Create Table': sql }] = await this.execute(`SHOW CREATE TABLE ${MySQLDriver.tbl(tableName)};`);

		const lines = sql
			.split('\n')
			.slice(1, -1)
			.map((line) => line.trim().replace(/,$/, ''));

		lines.forEach((line) => {
			if (line.startsWith('`')) {
				const query = line.replace('tinyint(1)', 'boolean');
				const col = Column.fromQuery(query, ReverseMySQLTypes);

				table.columns.push(col);
			} else {
				// TODO: CONSTRAINT
			}
		});

		return table;
	}

	async updateTable(table: Table) {
		const t = await this.fetchTable(table.name);
		console.log(t);

		return null;
	}

	truncateTable(tableName: string): Promise<any> {
		return this.execute(`TRUNCATE TABLE ${MySQLDriver.tbl(tableName)};`);
	}

	dropTableIfExists(tableName: string): Promise<any> {
		return this.execute(`DROP TABLE IF EXISTS ${MySQLDriver.tbl(tableName)};`);
	}

	dropTable(tableName: string): Promise<any> {
		return this.execute(`DROP TABLE ${MySQLDriver.tbl(tableName)};`);
	}

	private static compileConditions(conditions: ICondition[], tableName?: string): [string, TBaseValue[]] {
		const params = [];
		const query = conditions
			.map((condition, index) => {
				const relation = index === 0 ? '' : { and: 'AND', or: 'OR' }[condition.relation];
				let clause = index === 0 ? '' : `${relation} `;

				if (condition.type === 'raw') {
					params.push(...condition.params);
					clause += condition.query;

					return clause;
				}

				if (condition.type === 'group') {
					const [q, p] = this.compileConditions(condition.conditions, tableName);
					params.push(...p);
					clause += `(${q})`;

					return clause;
				}

				if (condition.type === 'column') {
					clause += `${this.col(condition.leftHandSide as string, tableName)} ${condition.operator} ${this.col(
						condition.rightHandSide as string,
						tableName
					)}`;

					return clause;
				}

				let lhs;
				if (condition.leftHandSide instanceof QueryBuilder) {
					const [q, p] = this.compileSelect(condition.leftHandSide);
					params.push(...p);
					lhs = `(${q})`;
				} else {
					lhs = this.col(condition.leftHandSide as string, tableName);
				}

				let rhs: any;
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
					if (condition.rightHandSide instanceof QueryBuilder) {
						clause += `${lhs} ${condition.type.startsWith('not') ? 'NOT IN' : 'IN'} ${rhs}`;
					} else {
						params.push(...(rhs as TBaseValue[]));
						clause += `${lhs} ${condition.type.startsWith('not') ? 'NOT IN' : 'IN'} (${new Array(
							(rhs as TBaseValue[]).length
						)
							.fill('?')
							.join(', ')})`;
					}
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
					return this.col(field.column, qb.options.table);
				}

				if (field.type === 'query') {
					const [q, p] = this.compileSelect(field.queryBuilder);

					params.push(...p);
					return `(${q})${field.alias ? ` AS ${this.tbl(field.alias)}` : ''}`;
				}

				if (field.type === 'raw') {
					params.push(...field.params);
					return field.query;
				}

				if (field.type === 'aggregate') {
					if (field.aggregation === 'count') {
						return `COUNT(*)${field.alias ? ` AS ${this.col(field.alias)}` : ''}`;
					}

					if (field.aggregation === 'average') {
						return `AVG(${this.col(field.column)})${field.alias ? ` AS ${this.col(field.alias)}` : ''}`;
					}

					if (field.aggregation === 'summation') {
						return `SUM(${this.col(field.column)})${field.alias ? ` AS ${this.col(field.alias)}` : ''}`;
					}

					if (field.aggregation === 'minimum') {
						return `MIN(${this.col(field.column)})${field.alias ? ` AS ${this.col(field.alias)}` : ''}`;
					}

					if (field.aggregation === 'maximum') {
						return `MAX(${this.col(field.column)})${field.alias ? ` AS ${this.col(field.alias)}` : ''}`;
					}
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

				let table;
				if (join.queryBuilder) {
					const [q, p] = this.compileSelect(join.queryBuilder);
					params.push(...p);

					table = `(${q}) ${this.tbl(join.alias)}`;
				} else {
					table = `${this.tbl(join.table)}${join.alias ? ` ${this.tbl(join.alias)}` : ''}`;
				}

				let conditions;
				if (join.conditions) {
					const [q, p] = this.compileConditions(join.conditions, qb.options.table);
					params.push(...p);

					conditions = q;
				} else {
					conditions = `${this.col(join.column1, qb.options.table)} ${join.operator} ${this.col(
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

		if (qb.options.randomOrder) {
			return ['ORDER BY RAND(?)', [qb.options.randomSeed || Math.floor(Math.random() * 100000)]];
		}

		if (orders.length === 0) {
			return ['', []];
		}

		const params = [];
		const query = `ORDER BY ${orders
			.map((order) => {
				if (order.type === 'column') {
					return `${this.col(order.column, qb.options.table)} ${order.direction || 'ASC'}`;
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

		const params = [];
		let query = '';

		if (groups.length > 0) {
			query = `GROUP BY ${groups
				.map((group) => {
					if (group.type === 'column') {
						return this.col(group.column, qb.options.table);
					}

					if (group.type === 'raw') {
						params.push(...group.params);
						return group.query;
					}

					return '';
				})
				.join(', ')}`;
		}

		if (groups.length > 0 && havingConditions.length > 0) {
			query += ' ';
		}

		if (havingConditions.length > 0) {
			const [q, p] = this.compileConditions(havingConditions, qb.options.table);
			params.push(...p);
			query += `HAVING ${q}`;
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

			// eslint-disable-next-line no-loss-of-precision, @typescript-eslint/no-loss-of-precision
			return [`Limit ?,?`, [offset, 18446744073709551615]];
		}

		if (offset) {
			return [`Limit ?,?`, [offset, limit]];
		}

		return [`Limit ?`, [limit]];
	}

	private static compileSelect(queryBuilder: QueryBuilder): [string, TBaseValue[]] {
		const qb = queryBuilder.clone();

		if (qb.options.useSoftDeletes && qb.options.softDeleteTimestamp) {
			if (qb.options.onlyTrashed) {
				qb.groupWhereConditions().whereNotNull(qb.options.softDeleteTimestamp);
			} else if (!qb.options.withTrashed) {
				qb.groupWhereConditions().whereNull(qb.options.softDeleteTimestamp);
			}
		}

		if (qb.options.processFinalQuery instanceof Function) {
			qb.options.processFinalQuery(qb);
		}

		const [fieldsQuery, fieldsParams] = this.compileSelectFields(qb);
		const [whereQuery, whereParams] = this.compileWhere(qb);
		const [groupQuery, groupParams] = this.compileGroup(qb);
		const [orderQuery, orderParams] = this.compileOrder(qb);
		const [limitQuery, limitParams] = this.compileLimit(qb);
		const [unionQuery, unionParams] = this.compileUnion(qb);
		const [joinQuery, joinParams] = this.compileJoin(qb);

		const params = fieldsParams;

		let query = `SELECT ${fieldsQuery} `;
		if (qb.options.selectInto) {
			query += `INTO ${qb.options.selectInto} `;
		}

		if (qb.options.aliasTable) {
			const [q, p] = this.compileSelect(qb.options.aliasTable.queryBuilder);

			params.push(...p);
			query += `FROM (${q}) ${qb.options.aliasTable.alias ? `${this.tbl(qb.options.aliasTable.alias)} ` : ''}`;
		} else {
			query += `FROM ${this.tbl(qb.options.table)} `;
		}

		params.push(...joinParams, ...whereParams, ...groupParams, ...orderParams, ...limitParams, ...unionParams);
		query += `${[joinQuery, whereQuery, groupQuery, orderQuery, limitQuery, unionQuery]
			.filter((q) => q !== '')
			.join(' ')}`;

		qb.options.alongQueries.forEach((aqb) => {
			const [q, p] = this.compileSelect(aqb);

			params.push(...p);
			query += `;${q}`;
		});

		return [query, params];
	}

	select(queryBuilder: QueryBuilder): Promise<any> {
		return this.execute(...MySQLDriver.compileSelect(queryBuilder));
	}

	async count(queryBuilder: QueryBuilder): Promise<number> {
		const qb = queryBuilder.clone().selectRaw(`COUNT(*) AS ${MySQLDriver.col('mysql_driver_count')}`);

		if (qb.options.group.length > 0) {
			return qb.pluck('mysql_driver_count');
		}

		return (await qb.first()).mysql_driver_count;
	}

	async average(queryBuilder: QueryBuilder, column: TColumn): Promise<number> {
		const qb = queryBuilder
			.clone()
			.selectRaw(
				`AVG(${MySQLDriver.col(column, queryBuilder.options.table)}) AS ${MySQLDriver.col('mysql_driver_average')}`
			);

		if (qb.options.group.length > 0) {
			return qb.pluck('mysql_driver_average');
		}

		return (await qb.first()).mysql_driver_average;
	}

	async sum(queryBuilder: QueryBuilder, column: TColumn): Promise<number> {
		const qb = queryBuilder
			.clone()
			.selectRaw(
				`SUM(${MySQLDriver.col(column, queryBuilder.options.table)}) AS ${MySQLDriver.col('mysql_driver_summation')}`
			);

		if (qb.options.group.length > 0) {
			return qb.pluck('mysql_driver_summation');
		}

		return (await qb.first()).mysql_driver_summation;
	}

	async min(queryBuilder: QueryBuilder, column: TColumn): Promise<any> {
		const qb = queryBuilder
			.clone()
			.selectRaw(
				`MIN(${MySQLDriver.col(column, queryBuilder.options.table)}) AS ${MySQLDriver.col('mysql_driver_minimum')}`
			);

		if (qb.options.group.length > 0) {
			return qb.pluck('mysql_driver_minimum');
		}

		return (await qb.first()).mysql_driver_minimum;
	}

	async max(queryBuilder: QueryBuilder, column: TColumn): Promise<any> {
		const qb = queryBuilder
			.clone()
			.selectRaw(
				`MAX(${MySQLDriver.col(column, queryBuilder.options.table)}) AS ${MySQLDriver.col('mysql_driver_maximum')}`
			);

		if (qb.options.group.length > 0) {
			return qb.pluck('mysql_driver_maximum');
		}

		return (await qb.first()).mysql_driver_maximum;
	}

	async exists(queryBuilder: QueryBuilder): Promise<boolean> {
		const [query, params] = MySQLDriver.compileSelect(queryBuilder);

		const [result] = await this.execute(`SELECT EXISTS(${query}) AS ${MySQLDriver.col('exists')}`, params);

		return !!result.exists;
	}

	private static compileInsert(qb: QueryBuilder): [string, TBaseValue[]] {
		const params = [];
		let query = `INSERT${qb.options.ignoreDuplicates ? ' IGNORE' : ''} INTO ${this.tbl(qb.options.table)}`;

		const fieldNames = Object.keys(qb.options.insert[0]);
		query += `(${fieldNames.map((fieldName) => this.col(fieldName)).join(', ')}) VALUES `;

		const values = qb.options.insert.map((dataset) => {
			const placeHolders = [];

			fieldNames.forEach((fieldName) => {
				if (dataset[fieldName] instanceof SpatialData) {
					params.push(dataset[fieldName].sql);
					placeHolders.push('ST_GeomFromText(?)');
				} else {
					params.push(dataset[fieldName]);
					placeHolders.push('?');
				}
			});

			return `(${placeHolders.join(', ')})`;
		});

		query += `${values.join(', ')}`;

		return [query, params];
	}

	async insert(queryBuilder: QueryBuilder): Promise<IInsertionResult> {
		const result = await this.execute(...MySQLDriver.compileInsert(queryBuilder));
		return [result.insertId, result.affectedRows];
	}

	private static compileUpdateFields(qb: QueryBuilder): [string, TBaseValue[]] {
		const updateData = qb.options.update;

		const params = [];
		let query = Object.keys(updateData)
			.map((key) => {
				const column = this.col(key);
				const value = updateData[key];

				if (value === null) {
					return `${column} = NULL`;
				}

				if (value instanceof SpatialData) {
					params.push(value.sql);
					return `${column} = ST_GeomFromText(?)`;
				}

				params.push(value);
				return `${column} = ?`;
			})
			.join(', ');

		if (qb.options.useTimestamps && qb.options.updateTimestamp && !qb.options.silentUpdate) {
			query += `, ${this.col(qb.options.updateTimestamp)} = NOW()`;
		}

		return [query, params];
	}

	private static compileUpdate(qb: QueryBuilder): [string, TBaseValue[]] {
		const [fieldsQuery, fieldsParams] = this.compileUpdateFields(qb);
		const [whereQuery, whereParams] = this.compileWhere(qb);
		const [orderQuery, orderParams] = this.compileOrder(qb);
		const [offsetQuery, offsetParams] = this.compileLimit(qb);

		const params = [...fieldsParams, ...whereParams, ...orderParams, ...offsetParams];
		let query = `UPDATE ${qb.options.table} SET `;
		query += [fieldsQuery, whereQuery, orderQuery, offsetQuery].join(' ');

		return [query, params];
	}

	async update(queryBuilder: QueryBuilder): Promise<IModificationResult> {
		const result = await this.execute(...MySQLDriver.compileUpdate(queryBuilder));
		return [result.affectedRows, result.changedRows];
	}

	private static compileBulkUpdate(qb: QueryBuilder): [string, TBaseValue[]] {
		const data = qb.options.bulkUpdateData || [];
		const keys = qb.options.bulkUpdateKeys || [];

		if (data.length === 0) {
			return ['', []];
		}

		const dataKeys = Object.keys(data[0]);
		const updateKeys = dataKeys.filter((key) => !keys.includes(key));

		if (dataKeys.length === 0) {
			throw new Error('There are no fields to update');
		}
		if (updateKeys.length === 0 && qb.options.silentUpdate) {
			throw new Error('Bulk update dataset is empty');
		}

		if (keys.filter((key) => dataKeys.includes(key)).length !== keys.length)
			throw new Error('Bulk update keys are not present in the dataset');

		const params = [];
		const selects = data.map((row, index) => {
			const values = dataKeys.map((key) => row[key]);
			params.push(...values);

			if (index === 0) {
				return `SELECT ${dataKeys.map((key) => `? AS ${updateKeys.includes(key) ? 'new_' : ''}${key}`).join(', ')}`;
			}

			return `SELECT ${new Array(values.length).fill('?').join(', ')}`;
		});

		let query = `UPDATE ${this.tbl(qb.options.table)} ${this.tbl('bt')} `;
		query += `JOIN (${selects.join(' UNION ALL ')}) ${this.tbl('vt')} `;
		query += `ON ${keys.map((key) => `${this.col(key, 'bt')} = ${this.col(key, 'vt')}`).join(' AND ')} `;
		query += `SET ${updateKeys.map((key) => `${this.col(key)} = ${this.col(`new_${key}`)}`).join(', ')}`;

		if (qb.options.useTimestamps && !qb.options.silentUpdate) {
			query += `${updateKeys.length > 0 ? ', ' : ''}${this.col(qb.options.updateTimestamp)} = NOW()`;
		}

		return [query, params];
	}

	async bulkUpdate(queryBuilder: QueryBuilder): Promise<IModificationResult> {
		const result = await this.execute(...MySQLDriver.compileBulkUpdate(queryBuilder));
		return [result.affectedRows, result.changedRows];
	}

	private static compileDelete(qb: QueryBuilder): [string, TBaseValue[]] {
		const [whereQuery, whereParams] = this.compileWhere(qb);
		const [orderQuery, orderParams] = this.compileOrder(qb);
		const [limitQuery, limitParams] = this.compileLimit(qb);

		const params = [...whereParams, ...orderParams, ...limitParams];

		let query = `DELETE FROM ${this.tbl(qb.options.table)} `;
		query += [whereQuery, orderQuery, limitQuery].filter((q) => q !== '').join(' ');

		return [query, params];
	}

	async delete(queryBuilder: QueryBuilder): Promise<IModificationResult> {
		const result = await this.execute(...MySQLDriver.compileDelete(queryBuilder));
		return [result.affectedRows, result.changedRows];
	}

	private static compileSoftDelete(qb: QueryBuilder): [string, TBaseValue[]] {
		if (!qb.options.useSoftDeletes || !qb.options.softDeleteTimestamp) {
			return ['', []];
		}

		const [whereQuery, whereParams] = this.compileWhere(qb);
		const [orderQuery, orderParams] = this.compileOrder(qb);
		const [limitQuery, limitParams] = this.compileLimit(qb);

		const params = [...whereParams, ...orderParams, ...limitParams];

		let query = `UPDATE ${this.tbl(qb.options.table)} SET ${this.col(qb.options.softDeleteTimestamp)} = NOW() `;
		query += [whereQuery, orderQuery, limitQuery].filter((q) => q !== '').join(' ');

		return [query, params];
	}

	async softDelete(queryBuilder: QueryBuilder): Promise<IModificationResult> {
		if (!queryBuilder.options.useSoftDeletes) {
			throw new Error('Soft deletes are not enabled for this query builder');
		}

		if (!queryBuilder.options.softDeleteTimestamp) {
			throw new Error('Soft delete timestamp is not specified in this query builder');
		}

		const result = await this.execute(...MySQLDriver.compileSoftDelete(queryBuilder));
		return [result.affectedRows, result.changedRows];
	}

	private static compileUndelete(qb: QueryBuilder): [string, TBaseValue[]] {
		if (!qb.options.useSoftDeletes || !qb.options.softDeleteTimestamp) {
			return ['', []];
		}

		const [whereQuery, whereParams] = this.compileWhere(qb);
		const [orderQuery, orderParams] = this.compileOrder(qb);
		const [limitQuery, limitParams] = this.compileLimit(qb);

		const params = [...whereParams, ...orderParams, ...limitParams];

		let query = `UPDATE ${this.tbl(qb.options.table)} SET ${this.col(qb.options.softDeleteTimestamp)} = NULL `;
		query += [whereQuery, orderQuery, limitQuery].filter((q) => q !== '').join(' ');

		return [query, params];
	}

	async restore(queryBuilder: QueryBuilder): Promise<IModificationResult> {
		if (!queryBuilder.options.useSoftDeletes) {
			throw new Error('Soft deletes are not enabled for this query builder');
		}

		if (!queryBuilder.options.softDeleteTimestamp) {
			throw new Error('Soft delete timestamp is not specified in this query builder');
		}

		const result = await this.execute(...MySQLDriver.compileUndelete(queryBuilder));
		return [result.affectedRows, result.changedRows];
	}

	async setForeignKeyChecks(state: boolean): Promise<any> {
		await this.execute(`SET FOREIGN_KEY_CHECKS = ${state ? 1 : 0};`);
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
