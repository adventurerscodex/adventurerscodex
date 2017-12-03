import Should from 'should';
import { TreasureViewModel } from 'charactersheet/viewmodels/character/treasure';

describe('Treasure View Model', function() {
    var treasure_fixture = {
        'platinum': 1,
        'gold': 2,
        'electrum': 3,
        'silver': 4,
        'copper': 5
    };

    describe('Clear', function() {
        it('should clear all the values in it', function() {
            var coins = new TreasureViewModel();
            coins.treasure().platinum(treasure_fixture.platinum);
            coins.treasure().platinum().should.equal(treasure_fixture.platinum);
            coins.treasure().clear();
            coins.treasure().platinum().should.equal(0);

            coins.treasure().gold(treasure_fixture.gold);
            coins.treasure().gold().should.equal(treasure_fixture.gold);
            coins.treasure().clear();
            coins.treasure().gold().should.equal(0);

            coins.treasure().electrum(treasure_fixture.electrum);
            coins.treasure().electrum().should.equal(treasure_fixture.electrum);
            coins.treasure().clear();
            coins.treasure().electrum().should.equal(0);

            coins.treasure().silver(treasure_fixture.silver);
            coins.treasure().silver().should.equal(treasure_fixture.silver);
            coins.treasure().clear();
            coins.treasure().silver().should.equal(0);

            coins.treasure().copper(treasure_fixture.copper);
            coins.treasure().copper().should.equal(treasure_fixture.copper);
            coins.treasure().clear();
            coins.treasure().copper().should.equal(0);
        });
    });

    describe('Import', function() {
        it('should import an object with all the info supplied.', function() {
            var coins = new TreasureViewModel();
            coins.treasure().importValues(treasure_fixture);
            coins.treasure().platinum().should.equal(treasure_fixture.platinum);
            coins.treasure().gold().should.equal(treasure_fixture.gold);
            coins.treasure().electrum().should.equal(treasure_fixture.electrum);
            coins.treasure().silver().should.equal(treasure_fixture.silver);
            coins.treasure().copper().should.equal(treasure_fixture.copper);
        });
    });

    describe('Export', function() {
        it('should yield an object with all the info supplied.', function() {
            var coins = new TreasureViewModel();
            coins.treasure().platinum(treasure_fixture.platinum);
            coins.treasure().gold(treasure_fixture.gold);
            coins.treasure().electrum(treasure_fixture.electrum);
            coins.treasure().silver(treasure_fixture.silver);
            coins.treasure().copper(treasure_fixture.copper);
            var exported = coins.treasure().exportValues();
            exported.platinum.should.equal(coins.treasure().platinum());
            exported.gold.should.equal(coins.treasure().gold());
            exported.electrum.should.equal(coins.treasure().electrum());
            exported.silver.should.equal(coins.treasure().silver());
            exported.copper.should.equal(coins.treasure().copper());
        });
    });

    describe('WorthInGold', function() {
        it('should test if work in gold calculates correctly.', function() {
            var coins = new TreasureViewModel();
            coins.treasure().importValues(treasure_fixture);
            coins.treasure().worthInGold().should.equal(14);
        });
    });
});
