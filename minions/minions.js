var config = require('./config.js');

/*-----
m1.i1: {
	direction: 'input', 
	value: '19.000', 
	updateTime: ..., 
	alive: true }
m4.o1: {
	direction: 'output',
	value: 1,
	updateTime: ...,
	alive: true }
------*/
var pins = {};

/*------
on connection: send pins in json format.
on receive: expect a list of pin values like [{'m4.o1' : 1}]
	set {'m4.o1': 1}
	set [{'m4.o1': 1}]
	get 'm4.o1'
	get ['m4.o1']
server keeps sending pins in json format for all pins with value/updateTime/alive changed
-----*/
var server = createServer(config.getServicePort(), pins);

/*------
connect to minions and update pins
call server.updatePins() whenever minion pins change
------*/
/*connect(config.getMinions(), pins, function(updatedPins) {
	server.updatePins(updatedPins);
});
*/
function createServer(servicePort, pins) {
	var net = require('net');
	var server = net.createServer(function(c) {
		console.log('client connected (' + c.remoteAddress + ':' + c.remotePort + ')');
		
		c.on('end', function() {
			console.log('client disconnected');
		});
		
		var input = '';
		
		c.on('data', function(data) {
			input += data.toString();
			var i = input.indexOf('\n');
			if (i >= 0) {
				msg = input.substr(0, i);
				input = input.substr(i + 1);
				console.log(msg);
			}
		});
		
		// send all pins
		c.write('hello\n');
		//c.pipe(c);
	});
	
	server.listen(servicePort, function() {
		console.log('server started');
	});
	
	return {};
}
