import HTTPServer from 'src/http/server';

export default class Controller {}

/**
 * Register class method as HTTP route
 * @param method Defines HTTP verb
 * @param url Specifies the url for accessing route
 */
export function route(method: string, url: string | RegExp): MethodDecorator {
	const methodName = method.toLowerCase();

	return (target: any, key: string, descriptor: PropertyDescriptor) => {
		HTTPServer.registerRoute(
			methodName,
			url,
			(descriptor as any).middlewares,
			(descriptor as any).upload,
			descriptor.value.bind(target)
		);
	};
}

/**
 * Assigns one or more middlewares to a route
 * @param middlewareNames
 */
export function withMiddleware(...middlewareNames: string[]): MethodDecorator {
	return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
		const func = descriptor as any;

		func.middlewares = middlewareNames;

		return func;
	};
}

/**
 * Allow upload for a single file with specified field name
 * @param fieldName
 */
export function singleUpload(fieldName: string): MethodDecorator {
	return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
		const func = descriptor as any;

		if (func.upload) {
			throw new Error('Cannot apply more than one upload rule');
		}

		func.upload = {
			action: 'single',
			options: fieldName,
		};

		return func;
	};
}

/**
 * Allow upload for multiple files with specified field name
 * @param fieldName
 * @param maxCount
 */
export function arrayUpload(fieldName: string, maxCount?: number): MethodDecorator {
	return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
		const func = descriptor as any;

		if (func.upload) {
			throw new Error('Cannot apply more than one upload rule');
		}

		func.upload = {
			action: 'array',
			options: {
				fieldName,
				maxCount,
			},
		};

		return func;
	};
}

/**
 * Allow upload for multiple field names
 * @param fields
 */
export function multipleUpload(...fields: { name: string; maxCount?: number }[]): MethodDecorator {
	return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
		const func = descriptor as any;

		if (func.upload) {
			throw new Error('Cannot apply more than one upload rule');
		}

		func.upload = {
			action: 'multiple',
			options: fields,
		};

		return func;
	};
}

/**
 * Allow upload without any restrictions
 */
export function allowUpload(): MethodDecorator {
	return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
		const func = descriptor as any;

		if (func.upload) {
			throw new Error('Cannot apply more than one upload rule');
		}

		func.upload = {
			action: 'any',
		};

		return func;
	};
}

/**
 * Block any file upload
 */
export function preventUpload(): MethodDecorator {
	return (target: any, key: string, descriptor: PropertyDescriptor): PropertyDescriptor => {
		const func = descriptor as any;

		if (func.upload) {
			throw new Error('Cannot apply more than one upload rule');
		}

		func.upload = {
			action: 'block',
		};

		return func;
	};
}
