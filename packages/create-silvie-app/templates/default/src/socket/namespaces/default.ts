import SocketNamespace from 'silvie/socket/namespace';
import log from 'silvie/utils/log';

class DefaultNamespace extends SocketNamespace {
	onConnection = async (socket) => {
		log.success('Client Connected', socket.handshake.address);
	};
}

const defaultNamespace = new DefaultNamespace('/');

export default defaultNamespace;
