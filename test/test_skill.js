"use strict";

describe('Skill', function() {	
	describe('Bonus Label', function() {
		it('should yield the modifier value (signed).', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};
			var fb = OtherStats.findBy;
			OtherStats.findBy = function(id) {
				return [{
					proficiency: function() { return 2; }
				}];
			}
			var s = new Skill();
			s.name('Arcana');
			s.modifier(4);
			s.abilityScore('Wis');
			s.proficiency(true);
			
			s.bonusLabel().should.equal('+6 <i><small>(Wis)</small></i>');
			
			var s = new Skill(parent);
			s.name('Arcana');
			s.modifier(-4);
			s.abilityScore('Wis');
			s.proficiency(true);

			s.bonusLabel().should.equal('-2 <i><small>(Wis)</small></i>');	
			
			OtherStats.findBy = fb;	

			CharacterManager.activeCharacter = c;
		});
	});
	describe('Proficiency Label', function() {
		it('should yield the proficiency value (or none).', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};
			var fb = OtherStats.findBy;
			OtherStats.findBy = function(id) {
				return [{
					proficiency: function() { return 2; }
				}];
			}

			var s = new Skill(parent);
			s.name('Arcana');
			s.modifier(4);
			s.proficiency(true);

			s.proficiencyLabel().should.equal('glyphicon glyphicon-ok');
			
			var s = new Skill(parent);
			s.name('Arcana');
			s.modifier(-4);
			s.proficiency(false);

			s.proficiencyLabel().should.equal('');		
			OtherStats.findBy = fb;	

			CharacterManager.activeCharacter = c;
		});
	});
	describe('Clear', function() {
		it('should clear all values', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};
			var fb = OtherStats.findBy;
			OtherStats.findBy = function(id) {
				return [{
					proficiency: function() { return 2; }
				}];
			}

			var s = new Skill(parent);
			s.name('Arcana');
			s.modifier(4);
			s.proficiency(true);

			s.name().should.equal('Arcana');
			s.modifier().should.equal(4);
			s.proficiency().should.equal(true);
			s.clear();
			s.name().should.equal('');
			s.modifier().should.equal(0);
			s.proficiency().should.equal(false);
			OtherStats.findBy = fb;	

			CharacterManager.activeCharacter = c;
		});
	});
	
	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};
			var fb = OtherStats.findBy;
			OtherStats.findBy = function(id) {
				return [{
					proficiency: function() { return 2; }
				}];
			}

			var s = new Skill(parent);
			s.name('Arcana');
			s.modifier(4);
			s.proficiency(true);

			s.name().should.equal('Arcana');
			s.modifier().should.equal(4);
			s.proficiency().should.equal(true);
			var e = s.exportValues();
			e.name.should.equal(s.name());
			e.modifier.should.equal(s.modifier());
			e.proficiency.should.equal(s.proficiency());
			OtherStats.findBy = fb;	

			CharacterManager.activeCharacter = c;
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};
			var fb = OtherStats.findBy;
			OtherStats.findBy = function(id) {
				return [{
					proficiency: function() { return 2; }
				}];
			}

			var s = new Skill(parent);
			var e = { name: 'Arcana', modifier: 3, proficiency: true };
			s.importValues(e);
			e.name.should.equal(s.name());
			e.modifier.should.equal(s.modifier());
			e.proficiency.should.equal(s.proficiency());
			OtherStats.findBy = fb;	
			
			CharacterManager.activeCharacter = c;
		});
	});
});

