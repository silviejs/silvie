import Controller, { route, withMiddleware } from 'base/http/controller';
import { Request, Response } from 'express';

export default class ExampleController implements Controller {
	@route('GET', '/example')
	@withMiddleware('example')
	example(req: Request, res: Response): void {
		res.send('Example API');
	}
}
