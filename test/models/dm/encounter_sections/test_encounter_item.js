import { EncounterItem } from 'charactersheet/models';
import { Utility } from 'charactersheet/utilities';
import simple from 'simple-mock';

describe('EncounterItem', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('nameLabel', function() {
        it('should return a name if it exists', function() {
            var encounterItem = new EncounterItem();
            encounterItem.itemName('Potion');

            var label = encounterItem.nameLabel();
            label.should.equal('Potion');
        });
    });

    describe('propertyLabel', function() {
        it('should return a property', function() {
            var encounterItem = new EncounterItem();

            var label = encounterItem.propertyLabel();
            label.should.equal('N/A');
        });
    });

    describe('descriptionLabel', function() {
        it('should return a description if it exists', function() {
            var encounterItem = new EncounterItem();
            encounterItem.itemDesc('Blah');
            simple.mock(Utility.markdown, 'asPlaintext').returnWith('Blah');

            var label = encounterItem.descriptionLabel();
            label.should.equal('Blah');
        });
    });
});
