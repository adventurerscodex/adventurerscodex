"use strict";

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


describe('ProfileViewModel', function() {
	describe('Clear', function() {
		it('should clear all the values in profile', function() {
			var p = new ProfileViewModel();
			p.profile().characterName('Bob');
			p.profile().characterName().should.equal('Bob');
			p.clear();
			p.profile().characterName().should.equal('');
		});
	});

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var p = new ProfileViewModel();
			p.profile().characterName(val.profile.characterName);
			p.profile().playerName(val.profile.playerName);
			p.profile().level(val.profile.level);
			p.profile().exp(val.profile.exp);		
			var a = p.exportValues();
			a.profile.characterName.should.equal(p.profile().characterName());
			a.profile.playerName.should.equal(p.profile().playerName());
			a.profile.exp.should.equal(p.profile().exp());
			a.profile.level.should.equal(p.profile().level());
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var p = new ProfileViewModel();
			p.importValues(val);
			p.profile().characterName().should.equal(val.profile.characterName);
			p.profile().playerName().should.equal(val.profile.playerName);
			p.profile().level().should.equal(val.profile.level);
			p.profile().exp().should.equal(val.profile.exp);			
		});
	});
});

