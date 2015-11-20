"use strict";

describe('Skill', function() {
	
	var root = new RootViewModel();
	var parent = root.characterTabViewModel().skillTree();

	describe('Bonus Label', function() {
		it('should yield the modifier value (signed).', function() {
			var s = new Skill(parent);
			s.name('Arcana');
			s.modifier(4);
			s.abilityScore('Wis');
			s.root.characterTabViewModel().abilityScores().wis(11);
			s.proficiency(true);
			
			s.bonusLabel().should.equal('+4 <i><small>(Wis)</small></i>');
			
			var s = new Skill(parent);
			s.name('Arcana');
			s.modifier(-4);
			s.abilityScore('Wis');
			s.root.characterTabViewModel().abilityScores().wis(11);
			s.proficiency(true);

			s.bonusLabel().should.equal('-4 <i><small>(Wis)</small></i>');		
		});
	});
	describe('Proficiency Label', function() {
		it('should yield the proficiency value (or none).', function() {
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
		});
	});
	describe('Clear', function() {
		it('should clear all values', function() {
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
		});
	});
	
	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
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
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var s = new Skill(parent);
			var e = { name: 'Arcana', modifier: 3, proficiency: true };
			s.importValues(e);
			e.name.should.equal(s.name());
			e.modifier.should.equal(s.modifier());
			e.proficiency.should.equal(s.proficiency());
		});
	});
});

