import Controller, { route, singleUpload, withMiddleware } from 'base/http/controller';
import { Request, Response } from 'express';
import { MulterRequest } from 'base/extensions/express';

export default class ExampleController implements Controller {
	@route('GET', '/example')
	@withMiddleware('example')
	example(req: Request, res: Response): void {
		res.send('Example API');
	}

	@route('POST', '/example/upload')
	@withMiddleware('example')
	@singleUpload('example')
	exampleUpload(req: MulterRequest, res: Response): void {
		if (req.file) {
			res.send(`Got your file: '${req.file.originalname}' - ${(req.file.size / 1024).toFixed(1)} KB`);
		} else {
			res.send('No files uploaded!');
		}
	}
}
