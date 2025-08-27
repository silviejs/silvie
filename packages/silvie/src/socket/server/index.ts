import { Server as SocketIO } from 'socket.io';
import SocketNamespace from 'src/socket/namespace';
import flattenImports from 'src/utils/import/flatten';

const config = process.configs.socket;

class SocketServer {
	io: any;

	namespaces: SocketNamespace[] = [];

	init(HTTPServer, namespaces: SocketNamespace[], instanceCallback?: any) {
		let io = new SocketIO(HTTPServer.server, {
			path: config.path,
			connectTimeout: config.connectTimeout,
			upgradeTimeout: config.upgradeTimeout,
			pingTimeout: config.pingTimeout,
			pingInterval: config.pingInterval,
			transports: config.transports,
			allowUpgrades: config.allowUpgrades,
			perMessageDeflate: config.perMessageDeflate,
			httpCompression: config.httpCompression,
			allowEIO3: config.allowEIO3,
			cors: config.cors,
			cookie: config.cookie,
		});

		if (instanceCallback instanceof Function) {
			io = instanceCallback(io)
		}

		this.io = io;

		this.registerNamespace(...flattenImports(namespaces));
	}

	registerNamespace(...namespaces: SocketNamespace[]) {
		this.namespaces.push(...namespaces);

		namespaces.forEach((namespace) => {
			namespace.server = this;
			namespace.namespace = this.io.of(namespace.name);

			this.io.of(namespace.name).on('connection', namespace.onConnection);
		});
	}
}

const server = new SocketServer();

export default server;
