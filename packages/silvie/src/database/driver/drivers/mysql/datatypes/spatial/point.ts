import SpatialData from './index';

export default class PointData extends SpatialData {
	constructor(x: number, y: number) {
		super('POINT', `(${x} ${y})`);
	}
}
