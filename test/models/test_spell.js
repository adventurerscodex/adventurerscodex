'use strict';

describe('Spell Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var ft = new Spell();
            var saved = false;
            ft.ps.save = function() { saved = true; };

            saved.should.equal(false);
            ft.save();
            saved.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var ft = new Spell();
            ft.spellPrepared(true);
            ft.spellPrepared().should.equal(true);
            ft.clear();
            ft.spellPrepared().should.equal(false);
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var ft = new Spell();
            var e = {
                spellPrepared: true
            };
            ft.spellPrepared().should.equal(false);
            ft.importValues(e);
            ft.spellPrepared().should.equal(e.spellPrepared);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var ft = new Spell();
            ft.spellPrepared(true);
            ft.spellPrepared().should.equal(true);
            var e = ft.exportValues();
            ft.spellPrepared().should.equal(e.spellPrepared);
        });
    });

    describe('Delete', function() {
        it('should delete the objects.', function() {
            var ft = new Spell();
            var deleted = false;
            ft.ps.delete = function() { deleted = true; };

            deleted.should.equal(false);
            ft.delete();
            deleted.should.equal(true);
        });
    });

    describe('Spell Name Label', function() {
        it('should return the correct label', function() {
            var ritual = new Spell();
            ritual.spellName('Identify');
            ritual.isRitual(true);
            ritual.spellNameLabel().should.equal('Identify (Ritual)');

            var spell = new Spell();
            spell.spellName('Magic Missile');
            spell.isRitual(false);
            spell.spellNameLabel().should.equal('Magic Missile');
        });
    });

    describe('Spell Description Label', function() {
        it('should return the correct label', function() {
            var spell = new Spell();
            spell.spellDescription('This thing is cool.\n');
            spell.spellDescriptionHTML().should.equal('This thing is cool.<br />');

            var spell2 = new Spell();
            spell2.spellDescription('');
            spell2.spellDescriptionHTML().should.equal(
                '<div class="h3"><small>Add a description via the edit tab.</small></div>');
        });
    });

    describe('Spell Damage Label', function() {
        it('should return the correct label', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(PersistenceService, 'findBy').callFn(function(characterId) {
                var spellStat = new SpellStats();
                spellStat.characterId(characterId);
                simple.mock(spellStat, 'spellAttackBonus').returnWith(3);
                return [spellStat];
            });

            var ft = new Spell();
            ft.spellType('Attack Roll');
            ft.spellDmg('1D4');
            ft.spellDamageLabel().should.equal('1D4 [Spell Bonus: +3]');

            ft.spellType('Support');
            ft.spellDamageLabel().should.equal('1D4');
        });
    });

    describe('Spell Level Label', function() {
        it('should return the correct label', function() {
            var cantrip = new Spell();
            cantrip.spellLevel(0);
            cantrip.spellLevelLabel().should.equal('Cantrip');

            var spell = new Spell();
            spell.spellLevel(1);
            spell.spellLevelLabel().should.equal(1);
        });
    });

    describe('A Castable Spell', function() {
        it('should be castable if it is a cantrip', function() {
            var cantrip = new Spell();
            cantrip.spellLevel(0);
            cantrip.spellIsCastable().should.equal(true);
        });
        it('should be castable if it is prepared', function() {
            var spell = new Spell();
            spell.spellLevel(1);
            spell.spellPrepared(true);
            spell.spellIsCastable().should.equal(true);
        });
        it('should be castable if it is always prepared', function() {
            var spell = new Spell();
            spell.spellLevel(1);
            spell.spellAlwaysPrepared(true);
            spell.spellIsCastable().should.equal(true);
        });
        it('should not be castable if it is not prepared', function() {
            var spell = new Spell();
            spell.spellLevel(1);
            spell.spellIsCastable().should.equal(false);
        });
    });
});
