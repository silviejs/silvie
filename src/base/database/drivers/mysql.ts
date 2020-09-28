import mysql from 'mysql';
import IDatabaseDriver from 'base/database/driver';
import Table from 'base/database/table';
import Column from 'base/database/column';
import QueryBuilder from 'base/database/builders/query';
import { TBaseValue } from 'base/database/builders/condition';

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

	private static prepareColumn(columnName: string): string {
		return columnName
			.replace(/['"`]/, '')
			.split('.')
			.map((part) => `\`${part}\``)
			.join('.');
	}

	private static prepareValue(value: unknown): string {
		if (value === null) {
			return 'NULL';
		}

		return `'${value}'`;
	}

	private static compileColumn(column: Column): string {
		const parts = [];

		parts.push(`\`${column.name}\``);

		const type = this.resolveType(column.type);
		if (column.size) {
			parts.push(`${type}(${column.size})`);
		} else {
			parts.push(type);
		}

		if (type.endsWith('INT') && column.options.unsigned) parts.push('UNSIGNED');

		if (column.options.defaultValue) {
			parts.push(`DEFAULT ${this.prepareValue(column.options.defaultValue)}`);
		} else if (column.options.useCurrent) {
			parts.push(`DEFAULT CURRENT_TIMESTAMP`);
		}

		if (column.options.nullable) parts.push('NULL');
		else parts.push('NOT NULL');

		if (column.options.autoIncrement) parts.push('AUTO_INCREMENT');
		if (column.options.charset) parts.push(`CHARACTER SET ${column.options.charset}`);
		if (column.options.collation) parts.push(`COLLATE ${column.options.collation}`);

		return parts.join(' ');
	}

	private static compileCreateTable(table: Table): string {
		const { indices, fullTextIndices, spatialIndices, primaries, uniques } = table.getConstraints();

		let query = `CREATE TABLE ${table.name} (`;

		query += table.columns.map((column) => this.compileColumn(column)).join(',');

		if (primaries.length > 0) {
			query += `, PRIMARY KEY (${primaries.map((column) => `\`${column.name}\``).join(',')})`;
		}

		if (uniques.length > 0) {
			query += `, UNIQUE (${uniques.map((column) => `\`${column.name}\``).join(',')})`;
		}

		if (indices.length > 0) {
			query += `, ${indices.map((column) => `INDEX (\`${column.name}\`)`).join(',')}`;
		}

		if (fullTextIndices.length > 0) {
			query += `, ${fullTextIndices.map((column) => `FULLTEXT (\`${column.name}\`)`).join(',')}`;
		}

		if (spatialIndices.length > 0) {
			query += `, ${spatialIndices.map((column) => `SPATIAL (\`${column.name}\`)`).join(',')}`;
		}

		if (table.relations.length > 0) {
			query += `, ${table.relations
				.map(
					(relation) =>
						`FOREIGN KEY (\`${relation.foreignKey}\`) REFERENCES ${relation.table}(\`${relation.primaryKey}\`)`
				)
				.join(',')}`;
		}

		query += ');';

		return query;
	}

	createTable(table: Table): Promise<any> {
		return this.execute(MySQLDriver.compileCreateTable(table));
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

	select(queryBuilder: QueryBuilder): Promise<any> {
		const query = '';
		const params = [];

		return this.execute(query, params);
	}

	exists(queryBuilder: QueryBuilder): Promise<any> {
		const query = '';
		const params = [];

		return this.execute(query, params);
	}

	private static compileInsert(qb: QueryBuilder): [string, any[]] {
		const params = [];
		let query = `INSERT INTO ${this.prepareTable(qb.options.table)}`;

		const fieldNames = Object.keys(qb.options.insert[0]);
		query += `(${fieldNames.map(this.prepareColumn).join(',')}) VALUES `;

		const values = qb.options.insert.map((dataset) => {
			fieldNames.forEach((fieldName) => {
				params.push(dataset[fieldName]);
			});

			return `(${new Array(fieldNames.length).fill('?').join(',')})`;
		});

		query += `${values.join(',')};`;

		return [query, params];
	}

	insert(queryBuilder: QueryBuilder): Promise<any> {
		const [query, params] = MySQLDriver.compileInsert(queryBuilder);

		return this.execute(query, params);
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

	delete(queryBuilder: QueryBuilder): Promise<any> {
		const query = '';
		const params = [];

		return this.execute(query, params);
	}

	softDelete(queryBuilder: QueryBuilder): Promise<any> {
		const query = '';
		const params = [];

		return this.execute(query, params);
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
