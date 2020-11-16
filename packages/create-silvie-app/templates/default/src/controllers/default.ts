import Controller, { route } from 'silvie/http/controller';

export default class DefaultController implements Controller {
	@route('GET', '/')
	example(req: any, res: any): void {
		res.send('Hello From Silvie');
	}
}
