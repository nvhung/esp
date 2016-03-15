local cfg = {}
cfg.ssid = 'JULIEN'
cfg.pwd = '12341234'
wifi.setmode(wifi.SOFTAP)
wifi.setphymode(wifi.PHYMODE_B)
wifi.ap.config(cfg)
gpio.mode(4,gpio.OUTPUT)
gpio.write(4,gpio.HIGH)
srv=net.createServer(net.TCP)
srv:listen(80, function(conn)
	conn:on("receive", function(conn,payload)
		i, j, v = string.find(payload, "GET /([0,1]) ")
		if v == "0" or v == "1" then
			if v == "1" then
				gpio.write(4,gpio.HIGH)
			else
				gpio.write(4,gpio.LOW)
			end
			conn:send("GPIO2 = " .. v)
		else
			conn:send("Invalid request!")
		end
	end)
	conn:on("sent", function(conn) conn:close() end)
end)