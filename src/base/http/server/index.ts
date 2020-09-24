import http from 'http';
import https from 'https';
import spdy from 'spdy';
import fs from 'fs';
import path from 'path';
import Express, { Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import IMiddleware from 'base/http/middleware';

import config from 'config/http';

class HTTPServer {
	app: any;

	/**
	 * Initialize a new HTTP Server
	 */
	constructor() {
		const app = Express();

		// Configure cors
		if (config.cors.enabled) {
			app.use(
				cors({
					origin: config.cors.originsAllowed,
					methods: config.cors.methodsAllowed,
					allowedHeaders: config.cors.headersAllowed,
					exposedHeaders: config.cors.headersAllowed,
					credentials: config.cors.allowCredentials,
					maxAge: config.cors.maxAge,
					preflightContinue: config.cors.continuePreflight,
					optionsSuccessStatus: config.cors.optionsSuccessStatus,
				})
			);
		}

		// Configure body parser
		if (config.body.enabled) {
			if (config.body.json.enabled) {
				app.use(
					bodyParser.json({
						limit: config.body.json.limit,
						inflate: config.body.json.inflate,
						strict: config.body.json.strict,
						type: config.body.json.type,
					})
				);
			}
			if (config.body.urlencoded.enabled) {
				app.use(
					bodyParser.urlencoded({
						inflate: config.body.urlencoded.inflate,
						extended: config.body.urlencoded.extended,
						limit: config.body.urlencoded.limit,
						parameterLimit: config.body.urlencoded.parameterLimit,
						type: config.body.urlencoded.type,
					})
				);
			}
			if (config.body.text.enabled) {
				app.use(
					bodyParser.text({
						inflate: config.body.text.inflate,
						limit: config.body.text.limit,
						type: config.body.text.type,
						defaultCharset: config.body.text.defaultCharset,
					})
				);
			}
			if (config.body.raw.enabled) {
				app.use(
					bodyParser.raw({
						inflate: config.body.raw.inflate,
						limit: config.body.raw.limit,
						type: config.body.raw.type,
					})
				);
			}
		}

		// Configure cookie parser
		if (config.cookie.enabled) {
			if (config.session.enabled && config.session.secret !== config.cookie.secret) {
				throw new Error('Cookie and Session secrets do not match');
			}

			app.use(cookieParser(config.cookie.secret));
		}

		if (config.session.enabled) {
			if (config.cookie.enabled && config.cookie.secret !== config.session.secret) {
				throw new Error('Cookie and Session secrets do not match');
			}

			if (config.session.driver === 'file') {
			} else if (config.session.driver === 'redis') {
			} else {
				throw new Error(`Invalid session driver '${config.session.driver}'`);
			}
		}

		// Configure static serves
		config.statics.forEach((statics) => {
			console.log('registering static', statics.alias, statics.path);
			app.use(
				statics.alias ?? '/',
				Express.static(path.resolve(process.cwd(), statics.path), {
					cacheControl: statics.options.cacheControl,
					dotfiles: statics.options.dotfiles,
					etag: statics.options.etag,
					extensions: statics.options.extensions,
					immutable: statics.options.immutable,
					index: statics.options.index,
					lastModified: statics.options.lastModified,
					maxAge: statics.options.maxAge,
					redirect: statics.options.redirect,
				})
			);
		});

		this.app = app;
	}

	/**
	 * Return express server instance
	 */
	get server() {
		return this.app;
	}

	/**
	 * Registers a route handler with some middlewares
	 * @param method HTTP Verb
	 * @param url Route URL
	 * @param middlewares IMiddlewares array
	 * @param handler Route handler
	 */
	registerRoute(
		method: string,
		url: string,
		middlewares: IMiddleware[] = [],
		handler: (req: Request, res: Response) => void
	) {
		console.log('registering route', method, url);
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
	registerGlobalMiddleware(middleware: IMiddleware) {
		this.app.use((middleware as any).prototype.handler);
	}

	/**
	 * Starts listening on a port in this order: --port, -p, .env.APP_PORT, config.port, customPort
	 */
	start(customPort = 5000) {
		let server = null;
		if (config.HTTP2) {
			if (!config.ssl.enabled) {
				throw new Error('You have to enable SSL for HTTP/2');
			}
			if (!config.ssl.keyFile || !fs.existsSync(config.ssl.keyFile)) {
				throw new Error('Missing SSL Key file');
			}
			if (!config.ssl.certFile || !fs.existsSync(config.ssl.certFile)) {
				throw new Error('Missing SSL Cert file');
			}

			server = spdy.createServer(
				{
					key: fs.readFileSync(config.ssl.keyFile),
					cert: fs.readFileSync(config.ssl.certFile),
					passphrase: config.ssl.passphrase,
				},
				this.app
			);
		} else if (config.ssl.enabled) {
			if (!config.ssl.keyFile || !fs.existsSync(config.ssl.keyFile)) {
				throw new Error('Missing SSL Key file');
			}
			if (!config.ssl.certFile || !fs.existsSync(config.ssl.certFile)) {
				throw new Error('Missing SSL Cert file');
			}

			server = https.createServer(
				{
					key: fs.readFileSync(config.ssl.keyFile),
					cert: fs.readFileSync(config.ssl.certFile),
					passphrase: config.ssl.passphrase,
				},
				this.app
			);
		} else {
			server = http.createServer(this.app);
		}
		const port = process.args.port || process.args.p || process.env.APP_PORT || config.port || customPort;
		server.listen(port, (error) => {
			if (error) console.log('An error occurred');

			console.log(`Server is running on http${config.HTTP2 || config.ssl.enabled ? 's' : ''}://localhost:${port}`);
		});
	}
}

const server = new HTTPServer();

export default server;
