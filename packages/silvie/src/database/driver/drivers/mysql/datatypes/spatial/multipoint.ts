import SpatialData from './index';

export default class MultiPointData extends SpatialData {
	constructor(points: { x: number; y: number }[]) {
		super('MULTIPOINT', `(${points.map(({ x, y }) => `${x} ${y}`).join(', ')})`);
	}
}
