// eslint-disable-next-line no-unused-vars
import log from 'src/utils/log';

export default class SocketNamespace {
	server: any;

	namespace: any;

	name: string;

	availableRooms: string[] = [];

	constructor(name) {
		this.name = name;
	}

	onConnection = (socket) => {
		log.info(`Client Connected to ${this.name}`, socket.handshake.address);
	};

	registerEvent = (socket, event, handler) => {
		socket.on(event, (...args) => handler(socket, ...args));
	};

	joinRoom = (socket, roomName, callback = null) => {
		if (this.availableRooms && this.availableRooms.length > 0 && this.availableRooms.includes(roomName)) {
			if (callback) callback();

			socket.join(roomName);

			socket.emit('changedRoom', roomName);
		} else {
			socket.emit('errors', [`Invalid Room '${roomName}'`]);
		}
	};

	leaveRoom = (socket, roomName) => {
		socket.leave(roomName);

		socket.emit('leftRoom', roomName);
	};

	leaveAllRooms = (socket) => {
		socket.rooms.forEach((room) => {
			socket.emit('leftRoom', room);
		});
	};
}
