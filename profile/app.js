function User() {
	this.characterName =  ko.observable('', { persist: 'user.characterName'});
	this.playerName = ko.observable('', { persist: 'user.playerName' });
	this.race = ko.observable('', { persist: 'user.race' });
	this.religion = ko.observable('', { persist: 'user.religion' });
	this.alignment = ko.observable('', { persist: 'user.alignment' });
	this.typeClass = ko.observable('' ,{ persist: 'user.typeClass' });
	this.gender = ko.observable('', { persist: 'user.gender' });

	this.clear = function() {
		this.characterName('');
		this.playerName('');
		this.race('');
		this.religion('');
		this.typeClass('');
		this.alignment('');
		this.gender('');
	};
	
	this.importValues = function() {
		//TODO
	};
	this.exportValues = function() {
		//TODO
	};
};

//Ready
$(function(){
	ko.applyBindings(new User());
});
