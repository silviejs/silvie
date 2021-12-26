import SpatialData from './index';

export default class PolygonData extends SpatialData {
	constructor(outerData: string, innerData?: string) {
		super('POLYGON', `((${outerData}),${innerData ? `(${innerData})` : '0'})`);
	}
}
