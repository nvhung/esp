const net = require('net');
const _ = require('./lib/underscore');

function create(cfg) {
	const name = cfg.name;
	const host = cfg.host;
	const port = cfg.port;
	const inputsCount = cfg.inputsCount;
	const outputsCount = cfg.outputsCount;
	const reconnectInterval = 1000;
	
	var socket = null;
	var updateHandler = null;
	
	connect(handleConnectSuccess, handleConnectFailure, handleConnectionClose);
	
	function handleConnectSuccess() {
	}
	
	function handleConnectFailure() {
	}
	
	function handleConnectionClose() {
		setTimeout(() => {
			connect(handleConnectSuccess, handleConnectFailure, handleConnectionClose);
		}, reconnectInterval);
	}
	
	function connect(onSuccess, onFailure, onClose) {
		console.info('connecting to %s', name);
		
		var input = '';
		
		socket = net.connect(port, host, () => {
			console.info('connected to %s', name);
			
			if (onSuccess) {
				onSuccess();
			}
		});
		
		socket.on('data', (data) => {
			input = input + data.toString();
			var newLinePos = input.indexOf('\n');
		
			if (newLinePos != -1) {
				const msg = input.substr(0, newLinePos);
				input = input.substr(newLinePos + 1);
			
				processMessage(msg);
			}
		});
		
		socket.on('error', (err) => {
			console.error('%s error: %s', name, err);
			
			if (err.errno == 'ECONNREFUSED') {
				if (onFailure) {
					onFailure();
				}
			}
			else if (err.errno == 'ECONNRESET') {
			}
			else if (err.errno == 'ETIMEOUT') {
			}
		});
		
		socket.on('end', () => {
			console.info('%s ended', name);
		});
		
		socket.on('close', () => {
			console.info('%s closed', name);
			if (onClose) {
				onClose();
			}
		});
	}
	
	function processMessage(msg) {
		console.info('%s received: %s', name, msg);
		
		try {
			var states = JSON.parse(msg);
			
			if (_.isArray(states) && states.length == (inputsCount + outputsCount)) {
				console.info('%s new states: %s', name, JSON.stringify(states));
				
				for (var i = 0; i < inputsCount + outputsCount; i++) {
					if (i < states.length) {
						var pinName =(i < inputsCount) 
							? 'i.' + (i + 1)
							: 'o.' + (i - inputsCount + 1);
							
						updateHandler(pinName, states[i]);
					}
				}
			}
			else {
				console.error('%s invalid states: %s', name, JSON.stringify(states));
			}
		}
		catch (err) {
			console.error('%s error: %s', name, err);
		}
	}
	
	function update(pin, newValue) {
		console.info('update');
	}
	
	function setUpdateHandler(handler) {
		updateHandler = handler;
	}
	
	return {
		update: update,
		setUpdateHandler: setUpdateHandler
	}
}

exports.create = create;