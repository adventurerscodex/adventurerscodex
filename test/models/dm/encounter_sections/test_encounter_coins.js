'use strict';

describe('EncounterCoins', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('nameLabel', function() {
        it('should return a name if it exists', function() {
            var encounterCoins = new EncounterCoins();

            var label = encounterCoins.nameLabel();
            label.should.equal('Coins');
        });
    });

    describe('propertyLabel', function() {
        it('should return a property', function() {
            var encounterCoins = new EncounterCoins();

            var label = encounterCoins.propertyLabel();
            label.should.equal('N/A');
        });
    });

    describe('descriptionLabel', function() {
        it('should return a description', function() {
            var encounterCoins = new EncounterCoins();
            encounterCoins.gold(10);

            var label = encounterCoins.descriptionLabel();
            label.should.equal('10(gp)');
        });
        it('should return blank', function() {
            var encounterCoins = new EncounterCoins();

            var label = encounterCoins.descriptionLabel();
            label.should.equal('');
        });
    });
});
