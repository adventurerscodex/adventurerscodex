import { HitDiceType } from 'charactersheet/models/character/hit_dice_type';
import simple from 'simple-mock';

describe('Hit Dice Type Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var ft = new HitDiceType();
            var saved = false;
            ft.ps.save = function() { saved = true; };

            saved.should.equal(false);
            ft.save();
            saved.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var ft = new HitDiceType();
            ft.hitDiceType('D3');
            ft.hitDiceType().should.equal('D3');
            ft.clear();
            ft.hitDiceType().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var ft = new HitDiceType();
            var e = {
                hitDiceType: 'D5'
            };
            ft.hitDiceType().should.equal('');
            ft.importValues(e);
            ft.hitDiceType().should.equal(e.hitDiceType);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var ft = new HitDiceType();
            ft.hitDiceType('D2');
            ft.hitDiceType().should.equal('D2');
            var e = ft.exportValues();
            ft.hitDiceType().should.equal(e.hitDiceType);
        });
    });
    describe('Delete', function() {
        it('should delete the objects.', function() {
            var ft = new HitDiceType();
            var deleted = false;
            ft.ps.delete = function() { deleted = true; };

            deleted.should.equal(false);
            ft.delete();
            deleted.should.equal(true);
        });
    });
});
