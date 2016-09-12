'use strict';

describe('Skill Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Bonus Label', function() {
        it('should yield the modifier value (signed).', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            simple.mock(OtherStats, 'findBy').returnWith([{ proficiency: ko.observable(2) }]);

            var s = new Skill();
            s.name('Arcana');
            s.modifier(4);
            s.abilityScore('Wis');
            s.proficiency(true);

            s.bonusLabel().should.equal('+ 6 <i><small>(Wis)</small></i>');

            s = new Skill(parent);
            s.name('Arcana');
            s.modifier(-4);
            s.abilityScore('Wis');
            s.proficiency(true);

            s.bonusLabel().should.equal('- 2 <i><small>(Wis)</small></i>');
        });
    });
    describe('Proficiency Label', function() {
        it('should yield the proficiency value (or none).', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var s = new Skill(parent);
            s.name('Arcana');
            s.modifier(4);
            s.proficiency(true);

            s.proficiencyLabel().should.equal('fa fa-check');

            s = new Skill(parent);
            s.name('Arcana');
            s.modifier(-4);
            s.proficiency(false);

            s.proficiencyLabel().should.equal('');
        });
    });
    describe('Clear', function() {
        it('should clear all values', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var s = new Skill(parent);
            s.name('Arcana');
            s.modifier(4);
            s.proficiency(true);
            s.proficiencyType('expertise');

            s.name().should.equal('Arcana');
            s.modifier().should.equal(4);
            s.proficiency().should.equal(true);
            s.proficiencyType().should.equal('expertise');
            s.clear();
            s.name().should.equal('');
            Should.not.exist(s.modifier());
            s.proficiency().should.equal(false);
            s.proficiencyType().should.equal('');
        });
    });

    describe('Export', function() {
        it('should yield an object with all the info supplied.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var s = new Skill(parent);
            s.name('Arcana');
            s.modifier(4);
            s.proficiency(true);
            s.proficiencyType('expertise');

            s.name().should.equal('Arcana');
            s.modifier().should.equal(4);
            s.proficiency().should.equal(true);
            s.proficiencyType().should.equal('expertise');
            var e = s.exportValues();
            e.name.should.equal(s.name());
            e.modifier.should.equal(s.modifier());
            e.proficiency.should.equal(s.proficiency());
            e.proficiencyType.should.equal(s.proficiencyType());
        });
    });

    describe('Import', function() {
        it('should import an object with all the info supplied.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var s = new Skill(parent);
            var e = { name: 'Arcana', modifier: 3, proficiency: true , proficiencyType: 'expertise'};
            s.importValues(e);
            e.name.should.equal(s.name());
            e.modifier.should.equal(s.modifier());
            e.proficiency.should.equal(s.proficiency());
            e.proficiencyType.should.equal(s.proficiencyType());
        });
    });
});
