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

	constructor(name: string, type: string, size?: number, options: ColumnOptions = {}) {
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
	}

	static fromQuery(query: string, types: Record<string, string> = {}): Column {
		let type;
		let size;
		let params = [];

		const [, name] = query.match(/^`(.+)`/);
		let [, sqlType] = query.match(/^`.+` (.+\(.+\))/) || [];
		if (!sqlType) {
			[, sqlType] = query.match(/^`.+` ([^\s]+)/);
			type = sqlType;
		} else {
			let paramsStr;
			[type, paramsStr] = sqlType.split('(', 2);

			// 	eslint-disable-next-line no-eval
			params = eval(`[${paramsStr.substring(0, paramsStr.length - 1)}]`);
		}

		type = types[type];

		if (!['Enum', 'Set', 'Decimal'].includes(type)) {
			[size] = params;
		}

		const column = new Column(name, type, size);

		if (type === 'Decimal') {
			column.meta({ precision: params[0], scale: params[1] || 0 });
		}

		if (type === 'Enum' || type === 'Set') {
			column.meta({ values: params });
		}

		const [, charset] = query.match(/CHARACTER SET ([^\s]+)/i) || [];
		if (charset) {
			column.charset(charset);
		}

		const [, collation] = query.match(/COLLATE ([^\s]+)/i) || [];
		if (collation) {
			column.collate(collation);
		}

		const [, defaultValue] = query.match(/DEFAULT '(.+)'/i) || query.match(/DEFAULT ([^\s]+)/i) || [];
		if (defaultValue) {
			if (defaultValue === 'NULL') {
				column.default(null);
			} else if (['CURRENT_DATE', 'CURRENT_TIME', 'CURRENT_TIMESTAMP'].includes(defaultValue)) {
				column.useCurrent();
			} else {
				column.default(defaultValue);
			}
		}

		if (!query.includes('NOT NULL')) {
			column.nullable();
		}

		if (query.includes('AUTO_INCREMENT')) {
			column.autoIncrement();
		}

		return column;
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

	charset(charset: string): Column {
		this.options.charset = charset;

		return this;
	}

	collate(collation: string): Column {
		this.options.collation = collation;

		return this;
	}
}
