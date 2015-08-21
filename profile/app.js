function User() {
	this.characterName =  ko.observable('', { persist: 'user.characterName'});
	this.playerName = ko.observable('', { persist: 'user.playerName' });
	this.race = ko.observable('', { persist: 'user.race' });
	this.religion = ko.observable('', { persist: 'user.religion' });
	this.alignment = ko.observable('', { persist: 'user.alignment' });
	this.typeClass = ko.observable('' ,{ persist: 'user.typeClass' });
	this.gender = ko.observable('', { persist: 'user.gender' });
	this.level = ko.observable('1', { persist: 'user.level' });
	this.exp = ko.observable('0', { persist: 'user.exp' })

	this.clear = function() {
		this.characterName('');
		this.playerName('');
		this.race('');
		this.religion('');
		this.typeClass('');
		this.alignment('');
		this.gender('');
		this.level('1');
		this.exp('0');
	};
	
	this.importValues = function(values) {
		this.characterName(values.characterName);
		this.playerName(values.playerName);
		this.race(values.race);
		this.religion(values.religion);
		this.typeClass(values.typeClass);
		this.alignment(values.alignment);
		this.gender(values.gender);		
		this.level(values.level);
		this.exp(values.exp);
	};
	
	this.exportValues = function() {
		return {
			characterName: this.characterName(), 
			playerName: this.playerName(), 
			race: this.race(), 
			religion: this.religion(), 
			typeClass: this.typeClass(), 
			alignment: this.alignment(), 
			gender: this.gender(),
			level: this.level(),
			exp: this.exp()
		}
	};
};