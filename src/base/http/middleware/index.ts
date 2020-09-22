import { Request, Response } from 'express';
import HTTPServer from 'base/http/server';

export const middlewares = {};

export default interface Middleware {
	handler(req: Request, res: Response, next: () => void): void;
}

/**
 * Register middleware decorator
 * @param name The name to access middleware
 * @param global Weather to register this middleware in global scope or not
 */
export function middleware(name: string, global = false): (target: Middleware) => Middleware {
	return (target: Middleware): Middleware => {
		middlewares[name] = target;

		if (global) {
			HTTPServer.registerGlobalMiddleware(target);
		}

		return target;
	};
}
