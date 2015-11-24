"use strict";

function CharacterManager() {
	
	var self = this;
	
	self.totalLocalStorage = 5; //MB

    self.fileContents = ko.observable();
    self.fileReader = new FileReader();
    
    self.selectedCharacter = ko.observable();
    
	self.characterKeys = ko.observableArray([], { persist: 'character.characterKeys' });
	self.defaultCharacterKey = ko.observable('', { persist: 'character.defaultCharacterKey' });
	
	self.characters = ko.computed(function() {	
		return $.map(self.characterKeys(), function(key, _) {
			var vm = new RootViewModel();
			var oldKey = vm.key; 
			vm.key = function(){ return key; };
			vm.load();
			vm.url = '/charactersheet/?key=' + key;
			
			return vm;
		});
	});
	
	self.selectCharacter = function(character) {
		self.selectedCharacter(character);
	};
		
	self.addCharacter = function() {
		var key = uuid.v4();
		self.characterKeys.push(key);
		if (self.defaultCharacterKey() === '') {
			self.defaultCharacterKey(key);
		}
		window.location = '/charactersheet/?key=' + key + '&playerType=character'
	};
	
	self.addDM = function() {
		var key = uuid.v4();
		self.characterKeys.push(key);
		if (self.defaultCharacterKey() === '') {
			self.defaultCharacterKey(key);
		}
		window.location = '/charactersheet/?key=' + key + '&playerType=dm'
	};
	
	self.removeCharacter = function(character) {
		var key = character.key();
		//Delete old entries from local storage.
		$.each(getLocalStorageEntries(), function(_, _key) {
			if (_key.indexOf(key) !== -1) {
				localStorage.removeItem(_key);
			}
		});
		self.characterKeys.remove(key);
		if (self.defaultCharacterKey() === key) {
			if (self.characterKeys().length > 0) {
				self.defaultCharacterKey(self.characterKeys()[0]);
			} else {
				self.defaultCharacterKey('');
			}
		}		
	};
	
	self.keyInKeys = function(key) {
		return true ? (self.characterKeys().indexOf(key) !== -1) : false;
	};
	
	self.localStoragePercent = ko.computed(function() {
		var n = self.characterKeys().lenth; //Force ko to recompute on change.
		var used = JSON.stringify(localStorage).length / (0.5 * 1024 * 1024);
		return (used / self.totalLocalStorage * 100).toFixed(2);
	});
	
	self.importFromFile = function() {
		//The first comma in the result file string is the last
		//character in the string before the actual json data
		var length = self.fileReader.result.indexOf(",") + 1
		var values = JSON.parse(atob(self.fileReader.result.substring(
			length, self.fileReader.result.length)));
		
		//Set the default key to the new user's key. 
		var key = uuid.v4(),
			oldKey = self.defaultCharacterKey();
		self.defaultCharacterKey(key);
		
		//Create a new Character.
		var v = new RootViewModel();
		v.importValues(values);
		v.save();
				
		//Put everything back.
		self.defaultCharacterKey(oldKey);
		self.characterKeys.push(key);

		//If there's no other characters, make this one default.
		if (self.characterKeys().length === 1) {
			self.defaultCharacterKey(key);
		}
	}; 
} 

/**
 * Given a key stub, retrieve the active character's unique key. Use this key for 
 * storing to local storage.
 * 	{ persist: getKey('some.thing') }
 */
var getKey = function() {
	var key = keyFromUrl();
	key = (key !== false && (new CharacterManager()).keyInKeys(key)) ? key : 
		(new CharacterManager()).defaultCharacterKey();
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

/** 
 * Returns a list of all of the keys in local storage.
 */
var getLocalStorageEntries = function() {
	var name = [];
	for (var i in window.localStorage){
		name.push(i); // getting name from split string
	}
	return name;
};
