import HTTPServer from 'base/http/server';
import { middlewares } from 'base/http/middleware';

export default interface Controller {}

/**
 * Register class method as HTTP route
 * @param method Defines HTTP verb
 * @param url Specifies the url for accessing route
 */
export function route(method: string, url: string) {
	const methodName = method.toLowerCase();

	return (target, key, descriptor) => {
		HTTPServer.registerRoute(methodName, url, descriptor.middlewares, descriptor.value.bind(target));
	};
}

export function withMiddleware(...middlewareNames: string[]) {
	return (target, key, descriptor) => {
		const func = descriptor;
		func.middlewares = [];

		middlewareNames.forEach((name) => {
			if (name in middlewares) {
				descriptor.middlewares.push(middlewares[name]);
			} else {
				throw new Error(`Unknown middleware '${name}'`);
			}
		});

		return func;
	};
}
