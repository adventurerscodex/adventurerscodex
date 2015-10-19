"use strict";

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var uuid = require('node-uuid');

//Server

app.get('/', function(req, res){
	res.sendfile('models/test_chat.html');
});
app.get('/uuid.js', function(req, res){
	res.sendfile('bower_components/node-uuid/uuid.js');
});
app.get('/messenger.js', function(req, res){
	res.sendfile('models/messenger.js');
});

io.on('connection', function(socket){	
	//Message Types
	socket.on('join', function(msg) {
		//Join room if exists.
		socket.join(msg.roomId);
		io.to(msg.roomId).emit('system', 'yay, welcome');
	});
	socket.on('leave', function(msg) {
		//Leave room and clean up if last member.
	});
	socket.on('system', function(msg) {
		console.log('system', msg);
		io.to(msg.roomId).emit('system', msg);
	});
	socket.on('req', function(msg) {
		console.log('req', msg);
		io.to(msg.roomId).emit('req', msg);
	});
	socket.on('data', function(msg) {
		console.log('data', msg);
		io.to(msg.roomId).emit('data', msg);
	});
	socket.on('disconnect', function() {
		//Do cleanup and room maintenance.
	});
});

http.listen(3100, function(){
	console.log('listening on *:3100');
});

