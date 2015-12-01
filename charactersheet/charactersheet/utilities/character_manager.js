"use strict";

var CharacterManagerSignaler = {
	changing: new signals.Signal(),
	changed: new signals.Signal() 
};

var CharacterManager = {};

CharacterManager.changeCharacter = function(characterId) {
	var newChar = Character.findBy(characterId);
	CharacterManagerSignaler.changing.dispatch(self.active, newChar);
	CharacterManager.active = Character.findBy(characterId);
	CharacterManagerSignaler.changed.dispatch(self.active);
};

CharacterManager.activeCharacter = function() {
	var r = $.map(Character.findAll(), function(e, _) {
		if (e.isActive()) return e;
	})[0];	
	if (!r) {
		r = CharacterManager.defaultCharacter();
	}
	return r;
};

CharacterManager.defaultCharacter = function() {
	return $.map(Character.findAll(), function(e, _) {
		if (e.isDefault()) return e;
	})[0];
};

CharacterManager.keyIsValid = function (key) {
	return Character.findAll().some(function(e) {
		return e.key === key;
	});
};

/**
 * Retrieve the active character's unique key. 
 */
CharacterManager.getKey = function() {
	var key = keyFromUrl();
	key = (key !== false && CharacterManager.keyIsValid(key)) ? key : 
		CharacterManager.defaultCharacter().key;
	return key;
};

/**
 * If a key exists in the URL, return it, else return false.
 */
var keyFromUrl = function() {
	var uri = new URI();
	var map = uri.search(true);
	return map.key !== undefined ? map.key : false;
};

/**
 * If a key exists in the URL, return it, else return false.
 */
var playerTypeFromUrl = function() {
	var uri = new URI();
	var map = uri.search(true);
	return map.playerType !== undefined ? map.playerType : undefined;
};
