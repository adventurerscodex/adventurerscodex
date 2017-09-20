import simple from 'simple-mock';

import { EncounterMagicItem } from 'charactersheet/models';
import { Utility } from 'charactersheet/utilities';

describe('EncounterMagicItem', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('nameLabel', function() {
        it('should return a name if it exists', function() {
            var encounterMagicItem = new EncounterMagicItem();
            encounterMagicItem.magicItemName('Wand of wanding');

            var label = encounterMagicItem.nameLabel();
            label.should.equal('Wand of wanding');
        });
    });

    describe('propertyLabel', function() {
        it('should return a property', function() {
            var encounterMagicItem = new EncounterMagicItem();
            encounterMagicItem.magicItemType('Wand');

            var label = encounterMagicItem.propertyLabel();
            label.should.equal('Wand');
        });
        it('should return a blank', function() {
            var encounterMagicItem = new EncounterMagicItem();

            var label = encounterMagicItem.propertyLabel();
            label.should.equal('');
        });
    });

    describe('descriptionLabel', function() {
        it('should return a description if it exists', function() {
            var encounterMagicItem = new EncounterMagicItem();
            encounterMagicItem.magicItemDescription('Blah');
            simple.mock(Utility.markdown, 'asPlaintext').returnWith('Blah');

            var label = encounterMagicItem.descriptionLabel();
            label.should.equal('Blah');
        });
    });
});
