'use strict';

describe('Skill Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Bonus Label', function() {
        it('should yield the modifier value (signed).', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            simple.mock(OtherStats, 'findBy').returnWith([{ proficiencyLabel: ko.observable(2) }]);

            var s = new Skill();
            s.name('Arcana');
            s.modifier(4);
            s.abilityScore('Wis');
            s.proficiency('proficient');

            s.bonusLabel().should.equal('+ 6');

            s = new Skill(parent);
            s.name('Arcana');
            s.modifier(-4);
            s.abilityScore('Wis');
            s.proficiency('proficient');

            s.bonusLabel().should.equal('- 2');
        });
    });

    describe('Name Label', function() {
        it('should yield the correct name label.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            simple.mock(OtherStats, 'findBy').returnWith([{ proficiencyLabel: ko.observable(2) }]);

            var s = new Skill();
            s.name('Arcana');
            s.abilityScore('Wis');

            s.nameLabel().should.equal('Arcana <i><small class="skills-ability-type">(Wis)</small></i>');

            s = new Skill(parent);
            s.name('Stealth');
            s.abilityScore('Dex');

            s.nameLabel().should.equal('Stealth <i><small class="skills-ability-type">(Dex)</small></i>');
        });
    });

    describe('Proficiency Label', function() {
        it('should yield the proficiency value (or none).', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(OtherStats, 'findBy').returnWith([{ proficiencyLabel: ko.observable(2) }]);

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

    describe('Passive Bonus', function() {
        it('should yield the passive score', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            simple.mock(OtherStats, 'findBy').returnWith([{ proficiencyLabel: ko.observable(2) }]);

            var s = new Skill();
            s.name('Arcana');
            s.modifier(4);
            s.abilityScore('Wis');
            s.proficiency('proficient');

            s.passiveBonus().should.equal(16);

            s = new Skill();
            s.name('Arcana');
            s.modifier(4);
            s.abilityScore('Wis');

            s.passiveBonus().should.equal(14);
        });
    });

    describe('Clear', function() {
        it('should clear all values', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

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
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

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
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var s = new Skill(parent);
            var e = { name: 'Arcana', modifier: 3, proficiency: true , proficiencyType: 'expertise'};
            s.importValues(e);
            e.name.should.equal(s.name());
            e.modifier.should.equal(s.modifier());
            e.proficiency.should.equal(s.proficiency());
        });
    });
});
