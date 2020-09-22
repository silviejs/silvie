import Express, { Request, Response } from 'express';
import cors from 'cors';
import Middleware from 'base/http/middleware';

class HTTPServer {
	app: any;

	constructor(app) {
		this.app = app;

		app.use(cors());
	}

	registerRoute(
		method: string,
		url: string,
		middlewares: Middleware[] = [],
		handler: (req: Request, res: Response) => void
	) {
		this.app[method](
			url,
			middlewares.map((middleware) => middleware.handler),
			handler
		);
	}

	registerGlobalMiddleware(handler) {
		this.app.use(handler);
	}

	start(port: number = 4000) {
		this.app.listen(port, () => {
			console.log(`Example app listening at http://localhost:${port}`);
		});
	}
}

const server = new HTTPServer(Express());

export default server;
