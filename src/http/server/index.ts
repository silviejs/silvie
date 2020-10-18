import http from 'http';
import https from 'https';
import spdy from 'spdy';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import multer from 'multer';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import Express, { Request, Response } from 'express';
import { middlewares } from 'src/http/middleware';
import session from 'express-session';
import { v4 as uuid } from 'uuid';
import redis from 'redis';
import redisStore from 'connect-redis';
import fileStore from 'session-file-store';
import log from 'src/utils/log';

const config = process.configs.http;

class HTTPServer {
	app: any;

	upload: any;

	globalMiddlewares: string[] = [];

	routes = [];

	/**
	 * Initialize a new HTTP Server
	 */
	init() {
		this.app = Express();

		if (config.trustProxy) {
			this.app.set('trust proxy', 1);
		}

		this.initCORS();
		this.initBodyParser();
		this.initCookie();
		this.initSession();
		this.initUploads();
		this.initGlobalMiddlewares();
		this.initStatics();
		this.initRoutes();
	}

	initCORS() {
		if (config.cors.enabled) {
			this.app.use(
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
	}

	initBodyParser() {
		if (config.body.enabled) {
			if (config.body.json.enabled) {
				this.app.use(
					bodyParser.json({
						limit: config.body.json.limit,
						inflate: config.body.json.inflate,
						strict: config.body.json.strict,
						type: config.body.json.type,
					})
				);
			}
			if (config.body.urlencoded.enabled) {
				this.app.use(
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
				this.app.use(
					bodyParser.text({
						inflate: config.body.text.inflate,
						limit: config.body.text.limit,
						type: config.body.text.type,
						defaultCharset: config.body.text.defaultCharset,
					})
				);
			}
			if (config.body.raw.enabled) {
				this.app.use(
					bodyParser.raw({
						inflate: config.body.raw.inflate,
						limit: config.body.raw.limit,
						type: config.body.raw.type,
					})
				);
			}
		}
	}

	initSession() {
		if (config.session.enabled) {
			if (config.cookie.enabled && config.cookie.secret !== config.session.secret) {
				throw new Error('Cookie and Session secrets do not match');
			}

			let store;
			if (config.session.driver === 'file') {
				const FileStore = fileStore(session);

				store = new FileStore({
					path: path.resolve(
						process.rootPath,
						(process.env.NODE_ENV === 'development' ? `../.silvie/` : '') + config.session.driverOptions.file.path
					),
					extension: config.session.driverOptions.file.extension,
					ttl: config.session.driverOptions.file.ttl,
				});
			} else if (config.session.driver === 'redis') {
				const RedisStore = redisStore(session);
				const redisClient = redis.createClient();

				store = new RedisStore({
					client: redisClient,
					host: config.session.driverOptions.redis.host || process.env.REDIS_HOST,
					port: config.session.driverOptions.redis.port || process.env.REDIS_PORT,
					password: config.session.driverOptions.redis.password || process.env.REDIS_PASSWORD,
					ttl: config.session.driverOptions.redis.ttl,
					prefix: config.session.driverOptions.redis.prefix,
				});
			} else {
				throw new Error(`Invalid session driver '${config.session.driver}'`);
			}

			this.app.use(
				session({
					genid: () => uuid(),
					secret: config.session.secret || process.env.APP_KEY,
					resave: config.session.reSave,
					saveUninitialized: config.session.saveUninitialized,
					unset: config.session.unsetAction,
					trustProxy: config.session.trustProxy,
					store,
					name: config.session.cookie.name,
				})
			);
		}
	}

	initCookie() {
		if (config.cookie.enabled) {
			if (config.session.enabled && config.session.secret !== config.cookie.secret) {
				throw new Error('Cookie and Session secrets do not match');
			}

			this.app.use(cookieParser(config.cookie.secret || process.env.APP_KEY));
		}
	}

	initUploads() {
		if (config.uploads.enabled) {
			this.upload = multer({
				dest: path.resolve(
					process.rootPath,
					(process.env.NODE_ENV === 'development' ? `../.silvie/` : '') + config.uploads.tempDirectory
				),
				limits: {
					fieldSize: config.uploads.maxFileSize,
				},
			});
		}
	}

	initStatics() {
		config.statics.forEach((statics) => {
			this.app.use(
				statics.alias ?? '/',
				Express.static(path.resolve(process.rootPath, statics.path), {
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
	}

	initGlobalMiddlewares() {
		this.globalMiddlewares.forEach((middlewareName) => {
			if (middlewareName in middlewares) {
				this.app.use(middlewares[middlewareName]);
			} else {
				throw new Error(`Unknown global middleware '${middlewareName}'`);
			}
		});
	}

	initRoutes() {
		this.routes.forEach((route) => {
			const middlewareHandlers = route.middlewares.map((middlewareName) => {
				if (middlewareName in middlewares) {
					return middlewares[middlewareName];
				}

				throw new Error(
					`Used unknown middleware '${middlewareName}' for route '${route.method.toUpperCase()} ${route.url}'`
				);
			});

			if (route.upload) {
				if (route.upload.action === 'block') {
					middlewareHandlers.push(this.upload.none());
				} else if (route.upload.action === 'any') {
					middlewareHandlers.push(this.upload.any());
				} else if (route.upload.action === 'multiple') {
					middlewareHandlers.push(this.upload.fields(route.upload.options));
				} else if (route.upload.action === 'array') {
					middlewareHandlers.push(this.upload.array(route.upload.options.fieldName, route.upload.options.maxCount));
				} else if (route.upload.action === 'single') {
					middlewareHandlers.push(this.upload.single(route.upload.options));
				} else {
					throw new Error(
						`Invalid upload type '${route.upload.action}' for route '${route.method.toUpperCase()} ${route.url}'`
					);
				}
			}

			this.app[route.method](route.url, middlewareHandlers, route.handler);
		});
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
	 * @param routeMiddlewares Route middlewares array
	 * @param upload Upload configuration
	 * @param handler Route handler
	 */
	registerRoute(
		method: string,
		url: string,
		routeMiddlewares: string[] = [],
		upload: { action: string; options?: any } = null,
		handler: (req: Request, res: Response) => void
	) {
		this.routes.push({
			method,
			url,
			middlewares: routeMiddlewares,
			upload,
			handler,
		});
	}

	/**
	 * Registers a middleware on the whole HTTP Server
	 * @param middlewareName The name middleware to register
	 */
	globalMiddleware(middlewareName: string) {
		this.globalMiddlewares.push(middlewareName);
	}

	/**
	 * Starts listening on a port in this order: --port, -P, .env.APP_PORT, config.port, customPort
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
		const port = process.args.port || process.env.APP_PORT || config.port || customPort;
		server.listen(port, (error) => {
			if (error) log.error('Server Start Failed', 'An error occurred');

			log.success('Server Started', `on http${config.HTTP2 || config.ssl.enabled ? 's' : ''}://localhost:${port}`);
		});
	}
}

const server = new HTTPServer();

export default server;
