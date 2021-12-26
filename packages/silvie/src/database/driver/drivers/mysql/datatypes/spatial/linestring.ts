import SpatialData from './index';

export default class LineStringData extends SpatialData {
	constructor(points: { x: number; y: number }[]) {
		super('LINESTRING', `(${points.map(({ x, y }) => `${x} ${y}`).join(', ')})`);
	}
}
