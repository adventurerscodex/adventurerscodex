  "use strict";

  var treasure_fixture = {
    'platinum': 1,
    'gold': 2,
    'electrum': 3,
    'silver': 4,
    'copper': 5,
    'misc': 'trinkets'
  };

  describe('Treasure', function() {
    describe('Clear', function() {
      it('should clear all the values in it', function() {
        var coins = new Treasure();
        coins.platinum(treasure_fixture.platinum);
        coins.platinum().should.equal(treasure_fixture.platinum);
        coins.clear();
        coins.platinum().should.equal(0);

        coins.gold(treasure_fixture.gold);
        coins.gold().should.equal(treasure_fixture.gold);
        coins.clear();
        coins.gold().should.equal(0);

        coins.electrum(treasure_fixture.electrum);
        coins.electrum().should.equal(treasure_fixture.electrum);
        coins.clear();
        coins.electrum().should.equal(0);

        coins.silver(treasure_fixture.silver);
        coins.silver().should.equal(treasure_fixture.silver);
        coins.clear();
        coins.silver().should.equal(0);

        coins.copper(treasure_fixture.copper);
        coins.copper().should.equal(treasure_fixture.copper);
        coins.clear();
        coins.copper().should.equal(0);

        coins.misc(treasure_fixture.misc);
        coins.misc().should.equal(treasure_fixture.misc);
        coins.clear();
        coins.misc().should.equal('');
      });
    });

  describe('Import', function() {
    it('should import an object with all the info supplied.', function() {
      var coins = new Treasure();
      coins.importValues(treasure_fixture);
      coins.platinum().should.equal(treasure_fixture.platinum);
      coins.gold().should.equal(treasure_fixture.gold);
      coins.electrum().should.equal(treasure_fixture.electrum);
      coins.silver().should.equal(treasure_fixture.silver);
      coins.copper().should.equal(treasure_fixture.copper);
      coins.misc().should.equal(treasure_fixture.misc);
    });
  });

  describe('Export', function() {
    it('should yield an object with all the info supplied.', function() {
      var coins = new Treasure();
      coins.platinum(treasure_fixture.platinum);
      coins.gold(treasure_fixture.gold);
      coins.electrum(treasure_fixture.electrum);
      coins.silver(treasure_fixture.silver);
      coins.copper(treasure_fixture.copper);
      coins.misc(treasure_fixture.misc);
      var exported = coins.exportValues();
      exported.platinum.should.equal(coins.platinum());
      exported.gold.should.equal(coins.gold());
      exported.electrum.should.equal(coins.electrum());
      exported.silver.should.equal(coins.silver());
      exported.copper.should.equal(coins.copper());
      exported.misc.should.equal(coins.misc());
    });
  });

  describe('WorthInGold', function() {
    it('should test if work in gold calculates correctly.', function() {
      var coins = new Treasure();
      coins.importValues(treasure_fixture);
      coins.worth_in_gold().should.equal(14);
    });
  });
});