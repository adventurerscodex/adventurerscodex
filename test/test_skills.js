"use strict";

describe('Skill Tree', function() {
	describe('Add Slots', function() {
		it('should add a new skill to the list of skills', function() {
			var p = new SkillTree();
			p.skills().length.should.equal(0);
			p.addSkill();
			p.skills().length.should.equal(1);
		});
	});
	
	describe('Remove Slot', function() {
		it('should remove a skill from the list of skills', function() {
			var p = new SkillTree();
			p.skills().length.should.equal(0);
			p.addSkill();
			p.skills().length.should.equal(1);
			p.removeSkill(p.skills().pop());
			p.skills().length.should.equal(0);			
		});
	});
	
	describe('Clear', function() {
		it('should clear all the values in skills.', function() {
			var p = new SkillTree();
			var skills = [new Skill('Archery', 0, true, function(){})];
			p.skills(skills);
			p.skills().should.equal(skills);
			p.clear();
			p.skills().length.should.equal(0);
		});
	});

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var p = new SkillTree();
			p.skills().length.should.equal(0);
			p.addSkill();
			p.skills().length.should.equal(1);
			var e = p.exportValues();
			e.skills.length.should.equal(p.skills().length);
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var p = new SkillTree();
			p.skills().length.should.equal(0);
			var skills = [{ level:10, maxSpellSlots: 0, usedSpellSlots: 4 }];
			p.importValues({ skills: skills });
			p.skills().length.should.equal(skills.length);
		});
	});
});

describe('Skill', function() {
	describe('Bonus Label', function() {
		it('should yield the bonus value (signed).', function() {
			var s = new Skill();
			s.name('Arcana');
			s.bonus(4);
			s.proficiency(true);
			
			s.bonusLabel().should.equal('+4');
			
			var s = new Skill();
			s.name('Arcana');
			s.bonus(-4);
			s.proficiency(true);

			s.bonusLabel().should.equal('-4');		
		});
	});
	describe('Proficiency Label', function() {
		it('should yield the proficiency value (or none).', function() {
			var s = new Skill();
			s.name('Arcana');
			s.bonus(4);
			s.proficiency(true);

			s.proficiencyLabel().should.equal('glyphicon glyphicon-ok');
			
			var s = new Skill();
			s.name('Arcana');
			s.bonus(-4);
			s.proficiency(false);

			s.proficiencyLabel().should.equal('');		
		});
	});
	describe('Clear', function() {
		it('should clear all values', function() {
			var s = new Skill();
			s.name('Arcana');
			s.bonus(4);
			s.proficiency(true);

			s.name().should.equal('Arcana');
			s.bonus().should.equal(4);
			s.proficiency().should.equal(true);
			s.clear();
			s.name().should.equal('');
			s.bonus().should.equal(0);
			s.proficiency().should.equal(false);
		});
	});
	
	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var s = new Skill();
			s.name('Arcana');
			s.bonus(4);
			s.proficiency(true);

			s.name().should.equal('Arcana');
			s.bonus().should.equal(4);
			s.proficiency().should.equal(true);
			var e = s.exportValues();
			e.name.should.equal(s.name());
			e.bonus.should.equal(s.bonus());
			e.proficiency.should.equal(s.proficiency());
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var s = new Skill('', 0, false, function(){});
			var e = { name: 'Arcana', bonus: 3, proficiency: true };
			s.importValues(e);
			e.name.should.equal(s.name());
			e.bonus.should.equal(s.bonus());
			e.proficiency.should.equal(s.proficiency());
		});
	});
});

