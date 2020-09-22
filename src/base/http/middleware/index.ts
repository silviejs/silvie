import { Request, Response } from 'express';
import HTTPServer from 'base/http/server';

export const middlewares = {};

export default interface Middleware {
	handler(req: Request, res: Response, next: Function): void;
}

/**
 * Register middleware decorator
 * @param name The name to access middleware
 * @param global Weather to register this middleware in global scope or not
 */
export function middleware(name: string, global: boolean = false) {
	return (Class) => {
		middlewares[name] = Class;

		if (global) {
			HTTPServer.registerGlobalMiddleware(Class.handler);
		}

		return Class;
	};
}
