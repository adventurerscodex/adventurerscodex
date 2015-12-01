"use strict";

function CharacterManagerViewModel() {
	var self = this;
	
	self.totalLocalStorage = 5; //MB

    self.fileContents = ko.observable();
    self.fileReader = new FileReader();
    
    self.selectedCharacter = ko.observable();
    
	self.characters = ko.observableArray([]);
	self.defaultCharacter = ko.observable(null);
	
	self.init = function() {
		
	};
	
	self.load = function() {
		var chars = Character.findAll();
		if (chars) {
			self.characters(chars);
			
			for (var i = 0; i<chars.length; i++) {
				if (chars[i].isDefault()) {
					self.defaultCharacter(chars[i]);
					break;
				}
			}
		}
	};
	
	self.unload = function() {
		$.each(self.characters(), function(_, e) {
			e.save();
		});
	};
		
	self.selectCharacter = function(character) {
		self.selectedCharacter(character);
	};
		
	self.addCharacter = function() {
		var character = new Character();
		character.key(uuid.v4());
		character.playerType(PlayerTypes.characterPlayerType);
		
		self.characters.push(character);
		if (!CharacterManager.defaultCharacter()) {
			character.isDefault(true);
		}
		character.save();
		window.location = character.url();
	};
	
	self.addDM = function() {
		var character = new Character();
		character.key(uuid.v4());
		character.playerType(PlayerTypes.dmPlayerType);
		
		self.characters.push(character);
		if (!CharacterManager.defaultCharacter()) {
			character.isDefault(true);
		}
		character.save();
		window.location = character.url();
	};
	
	self.removeCharacter = function(character) {
		var key = character.key();
		//Delete old entries from local storage.
		$.each(getLocalStorageEntries(), function(_, _key) {
			if (_key.indexOf(key) !== -1) {
				localStorage.removeItem(_key);
			}
		});
		self.character.remove(key);
		if (self.defaultCharacter() === key) {
			if (self.characterKeys().length > 0) {
				self.defaultCharacter(self.characterKeys()[0]);
			} else {
				self.defaultCharacter('');
			}
		}		
	};
		
	self.localStoragePercent = ko.computed(function() {
		var n = self.characters().lenth; //Force ko to recompute on change.
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
};
