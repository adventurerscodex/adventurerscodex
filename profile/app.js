"use strict";

function ProfileViewModel() {
	var self = this;

	self.characterName =  ko.observable('');
	self.playerName = ko.observable('');
	self.race = ko.observable('');
	self.religion = ko.observable('');
	self.alignment = ko.observable('');
	self.typeClass = ko.observable('');
	self.gender = ko.observable('');
	self.age = ko.observable('');
	self.height = ko.observable('');
	self.weight = ko.observable('');
	self.hairColor = ko.observable('');
	self.eyeColor = ko.observable('');
	self.skinColor = ko.observable('');
	self.level = ko.observable('');
	self.exp = ko.observable('');

	//UI Methods
	
	self.characterSummary = ko.computed(function() {
		var desc = ((self.race() && self.race() !== '') && 
						(self.typeClass() && self.typeClass() !== '') && 
						(self.level() && self.level() !== '')) ? 
					'A level ' + self.level() + ' ' + self.race() + ' ' + self.typeClass() + ' by ' 
						+ self.playerName() : false;
		var desc = desc || 'A unique character, handcrafted from the finest bits the '
			+ 'internet can provide.';
		return desc;
	});

	
	//Public Methods

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
