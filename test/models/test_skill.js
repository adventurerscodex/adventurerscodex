import simple from 'simple-mock'

import { Skill } from 'charactersheet/models/character/skill'

describe('Skill Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Bonus Label', function() {
        it('should yield the modifier value (signed).', function() {
            simple.mock(ProficiencyService.sharedService(), 'proficiency').returnWith(2);

            var s = new Skill();
            s.name('Arcana');
            s.modifier(4);
            s.abilityScore('Wis');
            s.proficiency('proficient');

            s.bonusLabel().should.equal('+ 6 <i><small>(Wis)</small></i>');

            s = new Skill(parent);
            s.name('Arcana');
            s.modifier(-4);
            s.abilityScore('Wis');
            s.proficiency('proficient');

            s.bonusLabel().should.equal('- 2 <i><small>(Wis)</small></i>');

            s = new Skill(parent);
            s.name('Arcana');
            s.modifier(2);
            s.abilityScore('Wis');
            s.proficiency('not');

            s.bonusLabel().should.equal('+ 2 <i><small>(Wis)</small></i>');

            s = new Skill(parent);
            s.name('Arcana');
            s.modifier(2);
            s.abilityScore('Wis');
            s.proficiency('half');

            s.bonusLabel().should.equal('+ 3 <i><small>(Wis)</small></i>');

            s = new Skill(parent);
            s.name('Arcana');
            s.modifier(2);
            s.abilityScore('Wis');
            s.proficiency('expertise');

            s.bonusLabel().should.equal('+ 6 <i><small>(Wis)</small></i>');
        });
    });
    describe('Proficiency Label', function() {
        it('should yield the proficiency value (or none).', function() {
            simple.mock(ProficiencyService.sharedService(), 'proficiency').returnWith(2);

            var s = new Skill(parent);
            s.name('Arcana');
            s.modifier(4);
            s.proficiency('proficient');

            s.proficiencyScore().should.equal(2);

            s = new Skill(parent);
            s.name('Arcana');
            s.modifier(-4);
            s.proficiency('half');

            s.proficiencyScore().should.equal(1);

            s = new Skill(parent);
            s.name('Arcana');
            s.modifier(-4);
            s.proficiency('expertise');

            s.proficiencyScore().should.equal(4);
        });
    });
    describe('Clear', function() {
        it('should clear all values', function() {
            var s = new Skill(parent);
            s.name('Arcana');
            s.modifier(4);
            s.proficiency('proficient');

            s.name().should.equal('Arcana');
            s.modifier().should.equal(4);
            s.proficiency().should.equal('proficient');
            s.clear();
            s.name().should.equal('');
            Should.not.exist(s.modifier());
            s.proficiency().should.equal('');
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
            var e = { name: 'Arcana', modifier: 3, proficiency: true , proficiencyType: 'expertise'};
            s.importValues(e);
            e.name.should.equal(s.name());
            e.modifier.should.equal(s.modifier());
            e.proficiency.should.equal(s.proficiency());
        });
    });
});
