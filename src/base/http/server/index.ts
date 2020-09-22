import Express, { Request, Response } from 'express';
import cors from 'cors';
import Middleware from 'base/http/middleware';

class HTTPServer {
	app: any;

	/**
	 * Initialize a new HTTP Server
	 */
	constructor() {
		this.app = Express();

		this.app.use(cors());
	}

	/**
	 * Registers a route handler with some middlewares
	 * @param method HTTP Verb
	 * @param url Route URL
	 * @param middlewares Middlewares array
	 * @param handler Route handler
	 */
	registerRoute(
		method: string,
		url: string,
		middlewares: Middleware[] = [],
		handler: (req: Request, res: Response) => void
	) {
		this.app[method](
			url,
			middlewares.map((middleware) => (middleware as any).prototype.handler),
			handler
		);
	}

	/**
	 * Registers a middleware on the whole HTTP Server
	 * @param middleware The middleware to register
	 */
	registerGlobalMiddleware(middleware: Middleware) {
		this.app.use((middleware as any).prototype.handler);
	}

	/**
	 * Starts listening on a port
	 * @param port Port number
	 */
	start(port = 4000) {
		this.app.listen(port, () => {
			console.log(`Example app listening at http://localhost:${port}`);
		});
	}
}

const server = new HTTPServer();

export default server;
