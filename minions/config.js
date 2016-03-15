var servicePort = 4935;
var minions = {
	m1: {
		hostIp: '192.168.1.138',
		hostPort: 4935,
		inputCount: 2,
		pingInterval: 1000
	},
	m2: {
		hostIp: '192.168.1.138',
		hostPort: 4935,
		inputCount: 2,
		pingInterval: 1000
	},
	m3: {
		hostIp: '192.168.1.138',
		hostPort: 4935,
		inputCount: 2,
		pingInterval: 1000
	},
	m4: {
		hostIp: '192.168.1.138',
		hostPort: 4935,
		outputCount: 1,
		pingInterval: 500
	}
};

exports.getMinions = function() {
	return minions;
};

exports.getServicePort = function() {
	return servicePort;
}