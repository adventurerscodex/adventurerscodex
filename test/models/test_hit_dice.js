'use strict';

describe('Hit Dice Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var ft = new HitDice();
            var saved = false;
            ft.ps.save = function() { saved = true; };

            saved.should.equal(false);
            ft.save();
            saved.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var ft = new HitDice();
            ft.hitDiceUsed(true);
            ft.hitDiceUsed().should.equal(true);
            ft.clear();
            ft.hitDiceUsed().should.equal(false);
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var ft = new HitDice();
            var e = {
                hitDiceUsed: true
            };
            ft.hitDiceUsed().should.equal(false);
            ft.importValues(e);
            ft.hitDiceUsed().should.equal(e.hitDiceUsed);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var ft = new HitDice();
            ft.hitDiceUsed(true);
            ft.hitDiceUsed().should.equal(true);
            var e = ft.exportValues();
            ft.hitDiceUsed().should.equal(e.hitDiceUsed);
        });
    });
    describe('Delete', function() {
        it('should delete the objects.', function() {
            var ft = new HitDice();
            var deleted = false;
            ft.ps.delete = function() { deleted = true; };

            deleted.should.equal(false);
            ft.delete();
            deleted.should.equal(true);
        });
    });

    describe('Toggle Hit Dice', function() {
        it('should toggle the object', function() {
            var ft = new HitDice();

            ft.hitDiceUsed().should.equal(false);
            ft.toggleHitDice();
            ft.hitDiceUsed().should.equal(true);
        });
    });

    describe('Hit Dice Icon', function() {
        it('should return a css class', function() {
            var ft = new HitDice();
            ft.hitDiceUsed(true);

            ft.hitDiceUsed().should.equal(true);
            var css = ft.hitDiceIcon();
            css.should.equal('dice-empty');
        });
    });

    describe('Find All', function() {
        it('should find all of the values in the db.', function() {
            var key = '1234';
            simple.mock(PersistenceService, 'findAll').returnWith([new HitDice(), new HitDice()]);
            var r = HitDice.findAllBy(key);
            r.length.should.equal(0);


            simple.mock(PersistenceService, 'findAll').returnWith([new HitDice(), new HitDice()].map(function(e, i, _) {
                e.characterId(key);
                return e;
            }));
            r = HitDice.findAllBy(key);
            r.length.should.equal(2);
        });
    });
});
