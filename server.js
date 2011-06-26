#!/usr/bin/env node

var drone   = require('ardrone');
var connect = require('connect');
var io      = require('socket.io').listen(8080);
var fs      = require('fs');

// Serve web interface
var server = connect.createServer(connect.static(__dirname + '/public'))
server.listen(8000)

//WebSocket
io.sockets.on('connection', function(socket) {
	socket.on('message', function(msg) {
	  		if (msg.charAt(0) == '{') { 			        
	        var props = JSON.parse(msg)
	        for (key in props) {
	          if (props.hasOwnProperty(key)) {
	            drone[key] = 0.4 * props[key]
	  					//console.log(props[key]);
	          }
	        }
	      } else {
	        var parts = msg.split(/\s/)
	        var cmd = parts[0]
	        var params = parts.slice(1)
	        for (var i = 0, l = params.length; i < l; i++) {
	          params[i] = parseFloat(params[i])
	        }
	        if (typeof drone[cmd] == 'function') {
	          console.log('Command sent: "' + cmd + '" With params: [' + params.join(', ') + ']')
	          drone[cmd].apply(drone, params)
	        } else {
	          console.log('NO SUCH COMMAND: ' + cmd)
	        }
	      }
	    });
});

