type TSpatialPrefix = 'POINT' | 'LINESTRING' | 'POLYGON' | 'MULTIPOINT' | 'MULTILINESTRING' | 'MULTIPOLYGON';

export default class SpatialData {
	public readonly sql: string;

	public readonly prefix: TSpatialPrefix;

	public readonly data: string;

	constructor(prefix: TSpatialPrefix, data: string) {
		this.data = data;
		this.prefix = prefix;
		this.sql = prefix + data;
	}
}
