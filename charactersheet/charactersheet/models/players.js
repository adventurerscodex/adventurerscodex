"use strict";

/**
 * A model that keeps track of the active players in the room.
 * The model tracks players that come into the room, and considers
 * them gone when they haven't responded for some time.
 */
function Players() {
	var self = this;
	
	self.SWEEP_TIMER = 2000;
	self.SAY_HI_TIMER = 10000;
	self.PLAYER_EXPIRED_TIMEOUT = 22000;
	
	self.inRoom = [];
	
	self._onPlayerEnters = [];
	self._onPlayerLeaves = [];
	
	self.init = function() {
		messenger.subscribe('data', 'hello?', self.handleHello);
		messenger.subscribe('data', 'goodbye!', self.handleGoodBye);
		messenger.subscribe('system', 'yay, welcome', function() {
			setInterval(self.sayHello, self.SAY_HI_TIMER);
			self.sayHello();
		});
	};
	
	self.unload = function() {
		self.sayGoodBye();
	};
	
	//Public methods.
	
	/**
	 * Subscribe to when a player enters the room. The
	 * player that leaves will be passed to the callback.
	 */
	self.onPlayerEnters = function(callback) {
		self._onPlayerEnters.push(callback);
	};
	
	/**
	 * Subscribe to when a player leaves the room. The
	 * player that leaves will be passed to the callback.
	 */
	self.onPlayerLeaves = function(callback) {
		self._onPlayerLeaves.push(callback);
	};	
	
	//Private methods.
	
	/**
	 * When the player first connects to the room, they should let 
	 * everyone know they're there by saying 'hello'.
	 */
	self.sayHello = function() {
		var player = new Player();
		player.name = Profile.find().characterName();
		player.id = CharacterManager.activeCharacter();

		messenger.sendDataMsg(ConnectionManager.find().roomId(), 'hello?', player);
	};
	
	/**
	 * When a player receives a hello message, add that player to the active list.
	 * Also, check the list for any players that havent responded recently and 
	 * remove them.
	 */	
	self.handleHello = function(player) {
		player.lastPing = (new Date).getTime();
		var playerInRoom = self.inRoom.some(function(a) {
			return a.id === player.id;
		});
		//Add them if they don't exist.
		if (!playerInRoom) {
			self.inRoom.push(player);
			self._alertPlayerEnter(player);
		} 
		//Update the last ping time if they're already there.
		else {
			self.inRoom = $.map(self.inRoom, function(e, _) {
				if (e.id === player.id ) {
					e.lastPing = player.lastPing;
				}
				return e;
			});
		}
	};
	
	/**
	 * When the player is going to leave the room, it's only 
	 * polite to say goodbye first.
	 */
	self.sayGoodBye = function() {
		var player = new Player();
		player.name = Profile.find().characterName();
		player.id = CharacterManager.activeCharacter();
		
		messenger.sendDataMsg(ConnectionManager.find().roomId(), 'goodbye!', player);
	};
	
	/**
	 * When a goodbye is received, remove that player from the active list.
	 */
	self.handleGoodBye = function(player) {
		self.inRoom = $.map(self.inRoom, function(p, _) {
			if (p.id !== player.id) {
				return p;
			}
		});
		self._alertPlayerLeft(player);
	};
	
	self._alertPlayerLeft = function(player) {
		$.each(self._onPlayerLeaves, function(_, callback) {
			callback(player);
		});
	};	

	self._alertPlayerEnter = function(player) {
		$.each(self._onPlayerEnters, function(_, callback) {
			callback(player);
		});
	};	
};

function Player() {
	var self = this;
	
	self.name = '';
	self.id = '';	
	self.lastPing = 0;
};
