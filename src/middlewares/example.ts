import Middleware, { middleware } from 'base/http/middleware';
import { Request, Response } from 'express';

@middleware('example')
export default class ExampleMiddleware implements Middleware {
	handler(req: Request, res: Response, next: () => void): void {
		console.log('in the middleware');

		next();
	}
}
