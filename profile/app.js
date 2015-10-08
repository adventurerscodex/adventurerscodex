"use strict";

function ProfileViewModel() {
	var self = this;

	self.characterName =  ko.observable('', { persist: getKey('profile.characterName') });
	self.playerName = ko.observable('', { persist: getKey('profile.playerName') });
	self.race = ko.observable('', { persist: getKey('profile.race') });
	self.religion = ko.observable('', { persist: getKey('profile.religion') });
	self.alignment = ko.observable('', { persist: getKey('profile.alignment') });
	self.typeClass = ko.observable('' ,{ persist: getKey('profile.typeClass') });
	self.gender = ko.observable('', { persist: getKey('profile.gender') });
	self.age = ko.observable('', { persist: getKey('profile.age') });
	self.height = ko.observable('', { persist: getKey('profile.height') });
	self.weight = ko.observable('', { persist: getKey('profile.weight') });
	self.hairColor = ko.observable('', { persist: getKey('profile.hairColor') });
	self.eyeColor = ko.observable('', { persist: getKey('profile.eyeColor') });
	self.skinColor = ko.observable('', { persist: getKey('profile.skinColor') });
	self.level = ko.observable('1', { persist: getKey('profile.level') });
	self.exp = ko.observable('0', { persist: getKey('profile.exp') });

	self.clear = function() {
		self.characterName('');
		self.playerName('');
		self.race('');
		self.religion('');
		self.typeClass('');
		self.alignment('');
		self.gender('');
		self.age('');
		self.height('');
		self.weight('');
		self.hairColor('');
		self.eyeColor('');
		self.skinColor('');
		self.level('1');
		self.exp('0');
	};
	
	self.importValues = function(values) {
		self.characterName(values.characterName);
		self.playerName(values.playerName);
		self.race(values.race);
		self.religion(values.religion);
		self.typeClass(values.typeClass);
		self.alignment(values.alignment);
		self.gender(values.gender);		
		self.age(values.age);
		self.height(values.height);
		self.weight(values.weight);
		self.hairColor(values.hairColor);
		self.eyeColor(values.eyeColor);
		self.skinColor(values.skinColor);
		self.level(values.level);
		self.exp(values.exp);
	};
	
	self.exportValues = function() {
		return {
			characterName: self.characterName(), 
			playerName: self.playerName(), 
			race: self.race(), 
			religion: self.religion(), 
			typeClass: self.typeClass(), 
			alignment: self.alignment(), 
			gender: self.gender(),
			age: self.age(),
			height: self.height(),
			weight: self.weight(),
			hairColor: self.hairColor(),
			eyeColor: self.eyeColor(),
			skinColor: self.skinColor(),
			level: self.level(),
			exp: self.exp()
		}
	};
};
