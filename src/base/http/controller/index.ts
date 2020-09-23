import HTTPServer from 'base/http/server';
import { middlewares } from 'base/http/middleware';

export default class Controller {}

/**
 * Register class method as HTTP route
 * @param method Defines HTTP verb
 * @param url Specifies the url for accessing route
 */
export function route(method: string, url: string): MethodDecorator {
	const methodName = method.toLowerCase();

	return (target: any, key: string, descriptor: PropertyDescriptor) => {
		HTTPServer.registerRoute(methodName, url, (descriptor as any).middlewares, descriptor.value.bind(target));
	};
}

/**
 *
 * @param middlewareNames
 */
export function withMiddleware(...middlewareNames: string[]): MethodDecorator {
	return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
		const func = descriptor as any;
		func.middlewares = [];

		middlewareNames.forEach((name: string) => {
			if (name in middlewares) {
				func.middlewares.push(middlewares[name]);
			} else {
				throw new Error(`Unknown middleware '${name}'`);
			}
		});

		return func;
	};
}
