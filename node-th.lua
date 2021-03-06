wifiSSID = "VIETHUNG"
wifiPWD = "98162400"
servicePort = 4935
serviceTimeout = 3000
checkWifiInterval1 = 100
checkWifiInterval2 = 1000
checkWifiInterval = checkWifiInterval1
debugRcv = false
debugSensor = false
wifiConnected = false
temperature = ""
humidity = ""
updateInterval = 2000
dhtPin = 7

function initPins()
	gpio.mode(4, gpio.OUTPUT)
	gpio.write(4, gpio.HIGH)
	gpio.mode(7, gpio.INPUT)
end

function blink(duration)
	gpio.write(4, gpio.LOW)
	tmr.alarm(2, duration, tmr.ALARM_SINGLE, function()
		gpio.write(4, gpio.HIGH)
	end)
end

function createOutput()
	local o = ""
	local i = 1
	for i = 1, table.getn(pinValues) do
		pinType = pinTypes[i] 
		pinValue = pinValues[i] 
		
		if pinType == 1 then
			pinValue = gpio.read(pinIndice[i])
		end
		
		if i > 1 then
			o = o .. ","
		end
		o = o .. tostring(pinValue)
	end
	return "[" .. o .. "]"
end

function startServer()
	print('start service')
	sv = net.createServer(net.TCP, serviceTimeout)
    sv:listen(servicePort, function(c)
		c:on("receive", function(c, msg)
			if debugRcv then
				print("rcv " .. msg)
			end
			
			c:send('[' .. temperature .. ',' .. humidity .. ']')
		end)
	end)
end

function stopServer()
	sv:close()
end

function checkWifi()
	if wifi.sta.getip() == nil then
		print("waiting for wifi")
		
		if wifiConnected == true then
			checkWifiInterval = checkWifiInterval1
			stopServer()
			wifi.sta.connect()
		end
		
		wifiConnected = false
	else
		if wifiConnected == false then
			print("wifi connected. ip " .. wifi.sta.getip())
			startServer()
			checkWifiInterval = checkWifiInterval2
		end
		
		wifiConnected = true
	end
	
	tmr.alarm (0, checkWifiInterval, 0, checkWifi)
end

tmr.alarm(1, 2000, tmr.ALARM_AUTO, function()
	if wifiConnected == false then
		blink(50)
	end
end)

tmr.alarm(3, updateInterval, tmr.ALARM_AUTO, function()
	local status, temp, humi, tempDec, humiDec = dht.read(dhtPin)
	
	if status == dht.OK then
		temperature = '' .. temp .. '.' .. tempDec
		humidity = '' .. humi .. '.' .. humiDec
		
		if debugSensor then
			print('temperature: ' .. temperature .. ', humidity: ' .. humidity)
		end
	end
end)

wifi.setmode(wifi.STATION)
wifi.sta.config(wifiSSID, wifiPWD, 1)

initPins()
checkWifi()