"use strict";

describe('Profile View Model', function() {
	var val = {
		profile: {
			"characterName":"Brom Eriksson",
			"playerName":"Brian Schrader",
			"race":"Elf",
			"religion":"",
			"typeClass":"Wizard",
			"alignment":"Good",
			"gender":"Male",
			"age":"233",
			"height":"5'1\"",
			"weight":"123",
			"hairColor":"Brown",
			"eyeColor":"Blue",
			"skinColor":"Red",
			"level":"15",
			"exp":"0"
		}
	};

	describe('Clear', function() {
		it('should clear all the values in profile', function() {
			var p = new ProfileViewModel();
			p.profile().characterName('Bob');
			p.profile().characterName().should.equal('Bob');
			p.clear();
			p.profile().characterName().should.equal('');
		});
	});
});

