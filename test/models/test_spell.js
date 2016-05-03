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

    describe('Spell Damage Label', function() {
        it('should return the correct label', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            simple.mock(SpellStats, 'findBy').callFn(function(characterId) {
                var spellStat = new SpellStats();
                spellStat.characterId(characterId);
                simple.mock(spellStat, 'spellAttackBonus').returnWith(3);
                return [spellStat];
            });

            var ft = new Spell();
            ft.spellType('Attack');
            ft.spellDmg('1D4');
            ft.spellDamageLabel().should.equal('1D4 [Spell Bonus: +3]');

            ft.spellType('Support');
            ft.spellDamageLabel().should.equal('1D4');
        });
    });

    describe('Find All', function() {
        it('should find all of the values in the db.', function() {
            var key = '1234';
            simple.mock(PersistenceService, 'findAll').returnWith([new Spell(), new Spell()]);
            var r = Spell.findAllBy(key);
            r.length.should.equal(0);


            simple.mock(PersistenceService, 'findAll').returnWith([new Spell(), new Spell()].map(function(e, i, _) {
                e.characterId(key);
                return e;
            }));
            r = Spell.findAllBy(key);
            r.length.should.equal(2);
        });
    });
});
