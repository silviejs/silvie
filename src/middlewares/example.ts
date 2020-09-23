import IMiddleware, { middleware } from 'base/http/middleware';
import { Request, Response } from 'express';

@middleware('example')
export default class ExampleMiddleware implements IMiddleware {
	handler(req: Request, res: Response, next: () => void): void {
		res.set('In-The', 'Middleware');

		next();
	}
}
