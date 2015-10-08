var val = {
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
};


describe('ProfileViewModel', function() {
	describe('Clear', function() {
		it('should clear all the values in profile', function() {
			var p = new ProfileViewModel();
			p.characterName('Bob');
			p.characterName().should.equal('Bob');
			p.clear();
			p.characterName().should.equal('');
		});
	});

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var p = new ProfileViewModel();
			p.characterName(val.characterName);
			p.playerName(val.playerName);
			p.level(val.level);
			p.exp(val.exp);		
			var a = p.exportValues();
			a.characterName.should.equal(p.characterName());
			a.playerName.should.equal(p.playerName());
			a.exp.should.equal(p.exp());
			a.level.should.equal(p.level());
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var p = new ProfileViewModel();
			p.importValues(val);
			p.characterName().should.equal(val.characterName);
			p.playerName().should.equal(val.playerName);
			p.level().should.equal(val.level);
			p.exp().should.equal(val.exp);			
		});
	});
});

