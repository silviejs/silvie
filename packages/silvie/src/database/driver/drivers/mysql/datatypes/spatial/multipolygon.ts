import SpatialData from './index';
import PolygonData from './polygon';

export default class MultiPolygonData extends SpatialData {
	constructor(polygons: PolygonData[]) {
		super('MULTIPOLYGON', `(${polygons.map((polygon) => polygon.data).join(', ')})`);
	}
}
