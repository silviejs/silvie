import mysql from 'mysql';
import IDatabaseDriver from 'base/database/driver';
import Table from 'base/database/table';
import Column from 'base/database/column';

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

export default class MySQLDriver implements IDatabaseDriver {
	pool: any;

	private types = {
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

	resolveType(typeName: string): string {
		return this.types[typeName];
	}

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

	prepareValue(value: unknown): string {
		if (value === null) {
			return 'NULL';
		}

		return `'${value}'`;
	}

	compileColumn(column: Column): string {
		const parts = [];

		parts.push(`\`${column.name}\``);

		const type = this.resolveType(column.type);
		parts.push(type);

		if (type.endsWith('INT') && column.options.unsigned) parts.push('UNSIGNED');
		if (column.options.defaultValue) parts.push(`DEFAULT ${this.prepareValue(column.options.defaultValue)}`);

		if (column.options.nullable) parts.push('NULL');
		else parts.push('NOT NULL');

		if (column.options.autoIncrement) parts.push('AUTO_INCREMENT');
		if (column.options.charset) parts.push(`CHARACTER SET ${column.options.charset}`);
		if (column.options.collation) parts.push(`COLLATE ${column.options.collation}`);

		return parts.join(' ');
	}

	compileCreateTable(table: Table): string {
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
		return this.execute(this.compileCreateTable(table));
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

	execute(query: string, params: string[] = []): Promise<any> {
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
