"use strict";

function Messenger() {
	var self = this;

	self._socket = null;
	self._socketUrl = 'http://brianschrader.com:3100';
		
	//Public message methods.	

	/**
	 * Send a system message to all clients connected to a room.
	 * @params to: Either a single id (room or individual).
	 * @params type: A classifier for the message type. 
	 * @params msg: The JSON msg payload.
	 */
	self.sendSystemMsg = function(to, type, data) {
		self._send(to, 'system', type, data);
	};

	/**
	 * Send a data message to all clients in the connected room.
	 * @params to: Either a single id (room or individual).
	 * @params type: A classifier for the message type. 
	 * @params msg: The JSON msg payload.
	 */
	self.sendDataMsg = function(to, type, data) {
		self._send(to, 'data', type, data);
	};

	/**
	 * Send a request message asking for data to the given members.
	 * @params to: Either a single id (room or individual).
	 * @params type: A classifier for the message type. 
	 * @params msg: The JSON msg payload.
	 */
	self.sendReqMsg = function(id, to, type, msg) {
		self._send(to, 'req', type, data);
	};
	
	/**
	 * Subscribe to incoming messages with a given type.
	 * @params classification: system, req, or data.
	 * @params type: The type of message to subscribe to.
	 * @params callback: The callback to be called when a 
	 * subscribed message is received.
	 */
	self.subscribe = function(classification, type, callback) {
		self._socket.on(classification, function(msg) {
			if (msg.type === type) {
				callback(msg.msg);
			}
		});
	};
	
	//Setting up a connection/room.
	
	self.connect = function(callback) {
		self._socket = io(self._socketUrl);
		self._socket.on('connect', self._onconnect);
		if (callback !== undefined) {
			callback();
		}
	};

	self.create = function() {
		var roomId = uuid.v4().substring(0, 8);
		self.join(roomId);
		return roomId;
	};
	
	self.join = function(id) {
		self._send(id, 'join', '', '');		
	};
	
	self.leave = function(id) {
		self._send(id, 'leave', '', '');		
	};
	
	//Private Methods.

	self._onconnect = function() {
		console.log('Connected!');
		self._connected = true;
	};
	
	self._send = function(roomId, classification, type, msg) {
		var payload = { 'type': type, 'msg': msg, 'roomId': roomId };
		self._socket.emit(classification, payload);
	};
};
