import LineStringData from './linestring';
import SpatialData from './index';

export default class MultiLineStringData extends SpatialData {
	constructor(lineStrings: LineStringData[]) {
		super('MULTILINESTRING', `(${lineStrings.map((lineString) => lineString.data).join(', ')})`);
	}
}
