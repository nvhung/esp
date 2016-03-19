// minion sample

const net = require('net');
const _ = require('./lib/underscore');
const states = [1, 0];
const inputsCount = 1;
const outputsCount = 1;
const connectedSockets = [];
const defaultServicePort = 3000;
const servicePort = process.argv.length > 2 ? parseInt(process.argv[2]) : defaultServicePort;

const server = net.createServer((socket) => {
	const socketAddress = getSocketAddress(socket);
	
	connectedSockets.push(socket);
	console.info('%s connected', socketAddress);
	socket.write(JSON.stringify(states) + '\r\n');
	
	var input = '';
	
	socket.on('data', (data) => {
		input = input + data.toString();
		var newLinePos = input.indexOf('\n');
		
		if (newLinePos != -1) {
			const msg = input.substr(0, newLinePos);
			input = input.substr(newLinePos + 1);
			
			processCommand(msg, socket);
		}
	}).on('error', (err) => {
		console.info('%s error: %s', socketAddress, err);
	}).on('end', () => {
		console.info('%s ended', socketAddress);
	}).on('close', () => {
		for (var i = 0; i < connectedSockets.length; i++) {
			if (connectedSockets[i] == socket) {
				connectedSockets.splice(i, 1);
			}
		}
		
		console.info('%s closed', socketAddress);
	});
}).on('error', (err) => {
	console.info('server error: %s', err);
}).on('close', () => {
	console.info('server closed');
});

server.listen(servicePort, () => {
	const address = server.address();
	console.info('server opened on %j', address);
});

function getSocketAddress(socket) {
	return socket.remoteAddress + ':' + socket.remotePort;
}

function processCommand(cmd, socket) {
	if (cmd.substr(cmd.length - 1) == '\r') {
		cmd = cmd.substr(0, cmd.length - 1);
	}
	
	const socketAddress = getSocketAddress(socket);
	
	console.info('%s received: %s', socketAddress, cmd);
	
	if (cmd == 'bye') {
		socket.end('bye\r\n');
	} else if (cmd == 'clients') {
		const connectedSocketAddresses = _.map(connectedSockets, function(connectedSocket) {
			return getSocketAddress(connectedSocket);
		});
		socket.write(JSON.stringify(connectedSocketAddresses) + '\r\n');
	} else {
		try {
			var newStates = JSON.parse(cmd);
			
			if (!_.isArray(newStates)) {
				newStates = [newStates];
			}
			
			console.info('%s new states: %s', socketAddress, JSON.stringify(newStates));
			
			setNewStates(states, inputsCount, newStates);
			sendToSockets(connectedSockets, states);
		}
		catch (err) {
			console.error('%s error: %s', socketAddress, err);
		}
	}
}

function setNewStates(states, inputsCount, newStates) {
	for (var i = 0; i < inputsCount; i++) {
		if (i < states.length && i < newStates.length) {
			states[i] = newStates[i];
		}
	}
}

function sendToSockets(sockets, states) {
	_.each(sockets, function(socket) {
		socket.write(JSON.stringify(states) + '\r\n');
	});
}

setInterval(() => {
	states[1] = states[1] == 0 ? 1 : 0;
	sendToSockets(connectedSockets, states);
}, 3000);