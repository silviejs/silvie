import Controller, { route, singleUpload, withMiddleware } from 'base/http/controller';
import { Response } from 'express';
import { ExtendedRequest } from 'base/extensions/express';

export default class ExampleController implements Controller {
	@route('GET', '/example')
	@withMiddleware('example')
	example(req: ExtendedRequest, res: Response): void {
		if (req.session.time) {
			res.send(`${req.session.time}\nExample API`);
		} else {
			req.session.time = Date.now();
			res.send('No time has been set in session\nExample API');
		}
	}

	@route('POST', '/example/upload')
	@withMiddleware('example')
	@singleUpload('example')
	exampleUpload(req: ExtendedRequest, res: Response): void {
		if (req.file) {
			res.send(`Got your file: '${req.file.originalname}' - ${(req.file.size / 1024).toFixed(1)} KB`);
		} else {
			res.send('No files uploaded!');
		}
	}
}
