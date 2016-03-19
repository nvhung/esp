const net = require('net');
const _ = require('./lib/underscore');
const M = require('./mo');
const mscfg = [
	{
		name: 'm1',
		host: 'localhost',
		port: 3000,
		inputsCount: 1,
		outputsCount: 1
	},
	{
		name: 'm2',
		host: 'localhost',
		port: 3001,
		inputsCount: 1,
		outputsCount: 1
	}
];
const pins = {};

start(mscfg, pins, () => {
	console.info('%s: %s', pin.name, pin.value);
});

function start(mscfg, pins, onPinUpdated) {
	const ms = [];
	
	for (var i = 0; i < mscfg.length; i++) {
		var mcfg = mscfg[i];
		
		for (var j = 1; j <= mcfg.inputsCount; j++) {
			var name = mcfg.name + '.i.' + j;
			
			pins[name] = { name: name };
		}
		
		for (var j = 1; j <= mcfg.outputsCount; j++) {
			var name = mcfg.name + '.o.' + j;
			
			pins[name] = { name: name };
		}
		
		var m = M.create(mcfg);
		ms.push(m);
	
		m.setUpdateHandler((pin, value) => {
			console.info('%s.%s: %s', mcfg.name, pin, value);
		});
	}
}