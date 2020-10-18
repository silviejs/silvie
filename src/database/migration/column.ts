export interface ColumnOptions {
	primary?: boolean;
	index?: string | boolean;
	fullTextIndex?: string | boolean;
	spatialIndex?: string | boolean;
	unique?: boolean;
	defaultValue?: any;
	autoIncrement?: boolean;
	nullable?: boolean;
	unsigned?: boolean;
	charset?: string;
	collation?: string;
	useCurrent?: boolean;
	meta?: any;
}

export default class Column {
	name: string;

	type: string;

	size: number;

	options: ColumnOptions;

	constructor(name: string, type: string, size: number, options: ColumnOptions = {}) {
		this.name = name;
		this.type = type;
		this.size = size;

		this.options = {
			primary: false,
			index: false,
			fullTextIndex: false,
			spatialIndex: false,
			unique: false,
			defaultValue: undefined,
			autoIncrement: false,
			nullable: false,
			unsigned: false,
			charset: null,
			collation: null,
			useCurrent: false,

			...options,
		};

		return this;
	}

	meta(metaData: unknown): Column {
		this.options.meta = metaData;

		return this;
	}

	autoIncrement(): Column {
		this.options.autoIncrement = true;

		return this;
	}

	nullable(): Column {
		this.options.nullable = true;

		return this;
	}

	default(value: unknown): Column {
		this.options.defaultValue = value;

		return this;
	}

	useCurrent(): Column {
		this.options.useCurrent = true;

		return this;
	}

	unsigned(): Column {
		this.options.unsigned = true;

		return this;
	}

	primary(): Column {
		this.options.primary = true;

		return this;
	}

	unique(): Column {
		this.options.unique = true;

		return this;
	}

	index(name = ''): Column {
		this.options.index = name || true;

		return this;
	}

	fullTextIndex(name = ''): Column {
		this.options.fullTextIndex = name || true;

		return this;
	}

	spatialIndex(name = ''): Column {
		this.options.spatialIndex = name || true;

		return this;
	}

	charset(value: string): Column {
		this.options.charset = value;

		return this;
	}

	collate(value: string): Column {
		this.options.collation = value;

		return this;
	}
}
