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
			
			pins[name] = { 
				name: name, 
				direction: 'input', 
				value: null, 
				updateTime: null 
			};
		}
		
		for (var j = 1; j <= mcfg.outputsCount; j++) {
			var name = mcfg.name + '.o.' + j;
			
			pins[name] = { 
				name: name, 
				direction: 'output', 
				value: null, 
				requestedValue: null, 
				updateTime: null 
			};
		}
		
		var m = M.create(mcfg);
		ms.push(m);
	
		m.setUpdateHandler((pinName, newValue) => {
			handlePinUpdate(pins[mcfg.name + '.' + pinName], newValue);
		});
	}
	
	console.info(pins);
}

function handlePinUpdate(pin, newValue) {
	console.info('%s: %s', pin.name, newValue);
	if (pin.value != newValue)) {
		console.info('% new value: %s', pin.name, newValue);
		
		pin.value = newValue;
		pin.updateTime = new Date();
		
		// update clients
	}
}