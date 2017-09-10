import simple from 'simple-mock'

import { Treasure } from 'charactersheet/models/common/treasure'
import { Treasure } from '../test'

describe('Treasure Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Instance Methods', function() {
        describe('Clear', function() {
            it('should clear all the data', function() {
                var treasure = new Treasure();
                treasure.gold(TreasureFixture.gold);
                treasure.gold().should.equal(TreasureFixture.gold);
                treasure.clear();
                treasure.gold().should.equal(0);
            });
        });

        describe('Import', function() {
            it('should import an object with all the info supplied.', function() {
                var treasure = new Treasure();
                treasure.importValues(TreasureFixture);
                treasure.gold().should.equal(TreasureFixture.gold);
                treasure.characterId().should.equal(TreasureFixture.characterId);
            });
        });

        describe('Export', function() {
            it('should yield an object with all the info supplied.', function() {
                var treasure = new Treasure();
                treasure.importValues(TreasureFixture);
                var values = treasure.exportValues();

                treasure.characterId().should.equal(values.characterId);
                treasure.gold().should.equal(values.gold);
            });
        });

        describe('Save', function() {
            it('should call the token save.', function() {
                var treasure = new Treasure();
                var spy = simple.mock(treasure.ps, 'save');
                treasure.save();
                spy.called.should.equal(true);
            });
        });
    });

    describe('Treasure Weight Label', function() {
        it('should return the correct label', function() {
            var treasure = new Treasure();
            treasure.gold(151);
            treasure.totalWeightLabel().should.equal('3 (lbs)');
        });
    });

    describe('Treasure Weight', function() {
        it('should return the correct weight', function() {
            var treasure = new Treasure();
            treasure.gold(151);
            treasure.copper(2);
            treasure.totalWeight().should.equal(3);
        });
    });

    describe('Worth in gold', function() {
        it('should return the correct worth in gold', function() {
            var treasure = new Treasure();
            treasure.gold(15);
            treasure.electrum(2);
            treasure.worthInGold().should.equal(16);
        });

        var types = ['copper', 'silver', 'electrum', 'gold', 'electrum', 'platinum'];

        types.forEach(function(type) {
            it('correctly converts blank ' + type + ' to zero (0)', function() {
                var treasure = new Treasure();
                treasure[type]('');
                treasure.worthInGold().should.equal(0);
            });
        });

    });

});
