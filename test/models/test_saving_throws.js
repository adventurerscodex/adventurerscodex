describe('Saving Throws Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Bonus Label', function() {
        it('should yield the modifier value (signed).', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(OtherStats, 'findBy').returnWith([{ proficiency: ko.observable(2)}]);

            var s = new SavingThrows();
            s.name('Wisdom');
            s.modifier(4);
            s.proficiency(true);

            s.modifierLabel().should.equal('+ 6');

            s = new SavingThrows();
            s.name('Arcana');
            s.modifier(-4);
            s.proficiency(true);

            s.modifierLabel().should.equal('- 2');
        });
    });

    describe('Ability Score Name', function() {
        it('should return a 3 letter version of the name', function() {
            var s = new SavingThrows();
            s.name('Wisdom');
            s._abilityScore().should.equal('wis');
        });
    });

    describe('Proficiency Label', function() {
        it('should yield the proficiency value (or none).', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var s = new SavingThrows();
            s.name('Wisdom');
            s.modifier(4);
            s.proficiency(true);

            s.proficiencyLabel().should.equal('fa fa-check');

            s = new SavingThrows();
            s.name('Wisdom');
            s.modifier(-4);
            s.proficiency(false);

            s.proficiencyLabel().should.equal('');
        });
    });
    describe('Clear', function() {
        it('should clear all values', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var s = new SavingThrows(parent);
            s.name('Wisdom');
            s.modifier(4);
            s.proficiency(true);

            s.name().should.equal('Wisdom');
            s.modifier().should.equal(4);
            s.proficiency().should.equal(true);
            s.clear();
            s.name().should.equal('');
            Should.not.exist(s.modifier());
            s.proficiency().should.equal(false);
        });
    });

    describe('Export', function() {
        it('should yield an object with all the info supplied.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var s = new SavingThrows();
            s.name('Wisdom');
            s.modifier(4);
            s.proficiency(true);

            s.name().should.equal('Wisdom');
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

            var s = new SavingThrows();
            var e = { name: 'Wisdom', modifier: 3, proficiency: true };
            s.importValues(e);
            e.name.should.equal(s.name());
            e.modifier.should.equal(s.modifier());
            e.proficiency.should.equal(s.proficiency());
        });
    });
});
