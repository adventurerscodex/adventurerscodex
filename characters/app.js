function CharacterManager() {
	"use strict";
	
	var self = this;
	
	self.totalLocalStorage = 5; //MB

    self.fileContents = ko.observable();
    self.fileReader = new FileReader();
    
	self.defaultCharacterKey = ko.observable('', { persist: 'character.defaultCharacterKey' });
	self.characterKeys = ko.observableArray([], { persist: 'character.characterKeys' });
	
	self.characters = ko.computed(function() {	
		return $.map(self.characterKeys(), function(key, _) {
			var playerName = eval(localStorage[key + '.' + 'profile.playerName']) || 'Some Player';
			var characterName = eval(localStorage[key + '.' + 'profile.characterName']) || 'Some Character';
			
			var race = eval(localStorage[key + '.' + 'profile.race']), 
				typeClass = eval(localStorage[key + '.' + 'profile.typeClass']),
				lvl = eval(localStorage[key + '.' + 'profile.level']);
			
			var desc = ((race && race !== '') && (typeClass && typeClass !== '') && (lvl && lvl !== '')) ? 
						'A level ' + lvl + ' ' + race + ' ' + typeClass + ' by ' + playerName
						: false;
			
			var characterDescription = desc || 'A unique character, handcrafted from the finest bits the '
				+ 'internet can provide.';
				
			return {
				characterName: characterName,
				characterDescription: characterDescription,
				playerName: playerName,
				playerUrl: '/?key=' + key,
				isDefault: key === self.defaultCharacterKey(),
				key: key
			}
		});
	});
		
	self.addCharacter = function() {
		var key = uuid.v4();
		self.characterKeys.push(key);
		window.location = '/?key=' + key
	};
	
	self.removeCharacter = function(character) {
		var key = character.key;
		//Delete old entries from local storage.
		$.each(getLocalStorageEntries(), function(_, _key) {
			if (_key.indexOf(key) !== -1) {
				localStorage.removeItem(_key);
			}
		});
		self.characterKeys.remove(key);
	};
	
	self.keyInKeys = function(key) {
		return true ? (self.characterKeys().indexOf(key) !== -1) : false;
	};
	
	self.localStoragePercent = ko.computed(function() {
		var n = self.characterKeys().lenth; //Force ko to recompute on change.
		var used = JSON.stringify(localStorage).length / (2 * 1024 * 1024);
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
		var v = new ViewModel();
		v.importValues(values);
				
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
getKey = function(tail) {
	var key = keyFromUrl();
	key = (key !== false && (new CharacterManager()).keyInKeys(key)) ? key : 
		(new CharacterManager()).defaultCharacterKey();
	return key + '.' + tail;
};

/**
 * If a key exists in the URL, return it, else return false.
 */
keyFromUrl = function() {
	var uri = new URI();
	var map = uri.search(true);
	return map.key !== undefined ? map.key : false;
};

/** 
 * Returns a list of all of the keys in local storage.
 */
getLocalStorageEntries = function() {
	var name = [];
	for (var i in window.localStorage){
		name.push(i); // getting name from split string
	}
	return name;
};
