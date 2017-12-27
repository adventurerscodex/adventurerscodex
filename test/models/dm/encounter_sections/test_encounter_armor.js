import { EncounterArmor } from 'charactersheet/models';
import simple from 'simple-mock';

describe('EncounterArmor', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('nameLabel', function() {
        it('should return a name if it exists', function() {
            var encounterArmor = new EncounterArmor();
            encounterArmor.armorName('Shield');

            var label = encounterArmor.nameLabel();
            label.should.equal('Shield');
        });
    });

    describe('propertyLabel', function() {
        it('should return a property', function() {
            var encounterArmor = new EncounterArmor();
            encounterArmor.armorClass(12);

            var label = encounterArmor.propertyLabel();
            label.should.equal('AC 12');
        });
        it('should return a blank', function() {
            var encounterArmor = new EncounterArmor();

            var label = encounterArmor.propertyLabel();
            label.should.equal('');
        });
    });

    describe('descriptionLabel', function() {
        it('should return a description if it exists', function() {
            var encounterArmor = new EncounterArmor();
            encounterArmor.armorDescription('Blah');

            var label = encounterArmor.descriptionLabel();
            label.should.equal('Blah\n');
        });
    });
});
