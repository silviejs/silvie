import Column from 'database/migration/column';

export interface IRelation {
	foreignKey: string;
	primaryKey: string;
	table: string;
}
export interface IConstraintCollection {
	indices: Column[];
	fullTextIndices: Column[];
	spatialIndices: Column[];
	primaries: Column[];
	uniques: Column[];
}

export default class Table {
	name: string;

	columns: Column[] = [];

	relations: IRelation[] = [];

	constructor(name: string) {
		this.name = name;
	}

	private createColumn(name: string, type: string, size?: number): Column {
		const column = new Column(name, type, size);
		this.columns.push(column);
		return column;
	}

	getConstraints(): IConstraintCollection {
		const collection: IConstraintCollection = {
			indices: [],
			fullTextIndices: [],
			spatialIndices: [],
			primaries: [],
			uniques: [],
		};

		this.columns.forEach((column: Column) => {
			if (column.options.index) collection.indices.push(column);
			if (column.options.fullTextIndex) collection.fullTextIndices.push(column);
			if (column.options.spatialIndex) collection.spatialIndices.push(column);
			if (column.options.primary) collection.primaries.push(column);
			if (column.options.unique) collection.uniques.push(column);
		});

		return collection;
	}

	id(): void {
		this.unsignedBigInteger('id').autoIncrement().primary();
	}

	tinyIncrements(name: string): Column {
		return this.unsignedTinyInteger(name).autoIncrement().primary();
	}

	smallIncrements(name: string): Column {
		return this.unsignedSmallInteger(name).autoIncrement().primary();
	}

	mediumIncrements(name: string): Column {
		return this.unsignedMediumInteger(name).autoIncrement().primary();
	}

	increments(name: string): Column {
		return this.unsignedInteger(name).autoIncrement().primary();
	}

	bigIncrements(name: string): Column {
		return this.unsignedBigInteger(name).autoIncrement().primary();
	}

	tinyInteger(name: string): Column {
		return this.createColumn(name, 'TinyInteger');
	}

	unsignedTinyInteger(name: string): Column {
		return this.tinyInteger(name).unsigned();
	}

	smallInteger(name: string): Column {
		return this.createColumn(name, 'SmallInteger');
	}

	unsignedSmallInteger(name: string): Column {
		return this.smallInteger(name).unsigned();
	}

	mediumInteger(name: string): Column {
		return this.createColumn(name, 'MediumInteger');
	}

	unsignedMediumInteger(name: string): Column {
		return this.mediumInteger(name).unsigned();
	}

	integer(name: string): Column {
		return this.createColumn(name, 'Integer');
	}

	unsignedInteger(name: string): Column {
		return this.integer(name).unsigned();
	}

	bigInteger(name: string): Column {
		return this.createColumn(name, 'BigInteger');
	}

	unsignedBigInteger(name: string): Column {
		return this.bigInteger(name).unsigned();
	}

	bit(name: string): Column {
		return this.createColumn(name, 'Bit');
	}

	boolean(name: string): Column {
		return this.createColumn(name, 'Boolean');
	}

	decimal(name: string, precision: number, scale: number): Column {
		return this.createColumn(name, 'Decimal').meta({ precision, scale });
	}

	unsignedDecimal(name: string, precision: number, scale: number): Column {
		return this.decimal(name, precision, scale).unsigned();
	}

	float(name: string): Column {
		return this.createColumn(name, 'Float');
	}

	double(name: string): Column {
		return this.createColumn(name, 'Double');
	}

	year(name: string): Column {
		return this.createColumn(name, 'Year');
	}

	date(name: string): Column {
		return this.createColumn(name, 'Date');
	}

	time(name: string): Column {
		return this.createColumn(name, 'Time');
	}

	datetime(name: string): Column {
		return this.createColumn(name, 'DateTime');
	}

	timestamp(name: string): Column {
		return this.createColumn(name, 'Timestamp');
	}

	timestamps(): void {
		this.timestamp('created_at').useCurrent();
		this.timestamp('updated_at').useCurrent();
	}

	character(name: string, length = 255): Column {
		return this.createColumn(name, 'Character', length);
	}

	string(name: string, length = 255): Column {
		return this.createColumn(name, 'String', length);
	}

	binary(name: string, length = 255): Column {
		return this.createColumn(name, 'Binary', length);
	}

	tinyBlob(name: string): Column {
		return this.createColumn(name, 'TinyBlob');
	}

	blob(name: string): Column {
		return this.createColumn(name, 'Blob');
	}

	mediumBlob(name: string): Column {
		return this.createColumn(name, 'MediumBlob');
	}

	longBlob(name: string): Column {
		return this.createColumn(name, 'LongBlob');
	}

	tinyText(name: string): Column {
		return this.createColumn(name, 'TinyText');
	}

	text(name: string): Column {
		return this.createColumn(name, 'Text');
	}

	mediumText(name: string): Column {
		return this.createColumn(name, 'MediumText');
	}

	longText(name: string): Column {
		return this.createColumn(name, 'LongText');
	}

	enum(name: string, ...values: string[]): Column {
		return this.createColumn(name, 'Enum').meta({ values });
	}

	set(name: string, ...values: string[]): Column {
		return this.createColumn(name, 'Set').meta({ values });
	}

	geometry(name: string): Column {
		return this.createColumn(name, 'Geometry');
	}

	point(name: string): Column {
		return this.createColumn(name, 'Point');
	}

	lineString(name: string): Column {
		return this.createColumn(name, 'LineString');
	}

	polygon(name: string): Column {
		return this.createColumn(name, 'Polygon');
	}

	geometryCollection(name: string): Column {
		return this.createColumn(name, 'GeometryCollection');
	}

	multiPoint(name: string): Column {
		return this.createColumn(name, 'MultiPoint');
	}

	multiLineString(name: string): Column {
		return this.createColumn(name, 'MultiLineString');
	}

	multiPolygon(name: string): Column {
		return this.createColumn(name, 'MultiPolygon');
	}

	softDelete(): Column {
		return this.timestamp('deleted_at').nullable().default(null);
	}

	json(name: string): Column {
		return this.createColumn(name, 'JSON');
	}

	ipAddress(name: string): Column {
		return this.createColumn(name, 'String', 45);
	}

	macAddress(name: string): Column {
		return this.createColumn(name, 'String', 17);
	}

	uuid(name: string): Column {
		return this.createColumn(name, 'Character', 36);
	}

	foreign(foreignKey: string, primaryKey: string, table: string): void {
		if (!this.columns.find((column) => column.name === foreignKey)) {
			throw new Error(`Unknown column '${foreignKey}' in FK ${this.name}.${foreignKey} -> ${table}.${primaryKey}`);
		}

		this.relations.push({
			foreignKey,
			primaryKey,
			table,
		});
	}

	private modifyColumns(
		columnNames: string[],
		optionName: 'primary' | 'unique' | 'index' | 'fullTextIndex' | 'spatialIndex'
	): void {
		this.columns.forEach((column) => {
			if (columnNames.includes(column.name)) column.options[optionName] = true;
		});
	}

	primary(...columnNames: string[]): void {
		this.modifyColumns(columnNames, 'primary');
	}

	unique(...columnNames: string[]): void {
		this.modifyColumns(columnNames, 'unique');
	}

	index(...columnNames: string[]): void {
		this.modifyColumns(columnNames, 'index');
	}

	fullTextIndex(...columnNames: string[]): void {
		this.modifyColumns(columnNames, 'fullTextIndex');
	}

	spatialIndex(...columnNames: string[]): void {
		this.modifyColumns(columnNames, 'spatialIndex');
	}
}
