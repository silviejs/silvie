import Middleware, { middleware } from 'base/http/middleware';
import { Request, Response } from 'express';

@middleware('example')
export default class ExampleMiddleware implements Middleware {
	static handler(req: Request, res: Response, next: Function) {
		console.log('in the middleware');

		next();
	}
}
