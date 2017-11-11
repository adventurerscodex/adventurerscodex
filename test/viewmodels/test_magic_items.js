import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import {
    Item,
    MagicItem
} from 'charactersheet/models/common';
import {
    PersistenceService,
    SortService
} from 'charactersheet/services/common';
import { MagicItemsViewModel } from 'charactersheet/viewmodels/character/magic_items';
import { MockCharacterManager } from '../mocks';
import simple from 'simple-mock';

describe('Magic Items View Model', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Sort By', function() {
        it('should sort the list of magicItems by given criteria', function() {
            var magicItems = new MagicItemsViewModel();
            magicItems.sortBy('magicItemName');
            magicItems.sort().should.equal(magicItems.sorts['magicItemName desc']);
            magicItems.sortBy('magicItemName');
            magicItems.sort().should.equal(magicItems.sorts['magicItemName asc']);

            magicItems.sortBy('magicItemMaxCharges');
            magicItems.sort().should.equal(magicItems.sorts['magicItemMaxCharges asc']);
            magicItems.sortBy('magicItemMaxCharges');
            magicItems.sort().should.equal(magicItems.sorts['magicItemMaxCharges desc']);

            magicItems.sortBy('magicItemCharges');
            magicItems.sort().should.equal(magicItems.sorts['magicItemCharges asc']);
            magicItems.sortBy('magicItemCharges');
            magicItems.sort().should.equal(magicItems.sorts['magicItemCharges desc']);

            magicItems.sortBy('magicItemAttuned');
            magicItems.sort().should.equal(magicItems.sorts['magicItemAttuned asc']);
            magicItems.sortBy('magicItemAttuned');
            magicItems.sort().should.equal(magicItems.sorts['magicItemAttuned desc']);
        });
    });

    describe('Clear', function() {
        it('should clear all the values in the MagicItemsViewModel', function() {
            var magicItems = new MagicItemsViewModel();
            var magicItem = [new MagicItem()];
            magicItems.magicItems(magicItem);
            magicItems.magicItems().should.equal(magicItem);
            magicItems.clear();
            magicItems.magicItems().length.should.equal(0);
        });
    });

    describe('Remove Item', function() {
        it('should remove an item from the MagicItemsViewModel', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var magicItems = new MagicItemsViewModel();
            magicItems.clear();
            magicItems.magicItems().length.should.equal(0);
            magicItems.addItem(new Item());
            magicItems.magicItems().length.should.equal(1);
            magicItems.removeItem(magicItems.magicItems()[0]);
            magicItems.magicItems().length.should.equal(0);
        });
    });

    describe('Edit Item', function() {
        it('should select a magic item for editing.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var magicItems = new MagicItemsViewModel();

            var magicItem = new MagicItem();
            magicItem.magicItemName('Wand');
            magicItems.editItem(magicItem);
            magicItems.currentEditItem().magicItemName().should.equal(magicItem.magicItemName());
            magicItems.modalOpen().should.equal(true);
        });
    });

    describe('Add Item', function() {
        it('should add a new magic item to magic items', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

            var magicItems = new MagicItemsViewModel();
            magicItems.clear();
            magicItems.magicItems().length.should.equal(0);
            magicItems.addItem(new MagicItem());
            magicItems.magicItems().length.should.equal(1);
        });
    });

    describe('Total Item Weight', function() {
        it('should return a string with the total weight of all magic items.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var items = [new MagicItem(), new MagicItem()].map(function(e, i, _) {
                e.magicItemWeight(5);
                return e;
            });

            var magicItems = new MagicItemsViewModel();
            magicItems.totalMagicItemWeight().should.equal('0 (lbs)');

            magicItems = new MagicItemsViewModel();
            magicItems.magicItems(items);
            magicItems.magicItems().length.should.equal(2);
            magicItems.totalMagicItemWeight().should.equal('10 (lbs)');
        });

        it('should return 0 for weight if the weight is empty.', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var items = [new MagicItem(), new MagicItem()].map(function(e, i, _) {
                e.magicItemWeight('');
                return e;
            });

            var magicItems = new MagicItemsViewModel();
            magicItems.magicItems(items);
            magicItems.magicItems().length.should.equal(2);
            magicItems.totalMagicItemWeight().should.equal('0 (lbs)');
        });
    });

    describe('Select Preview Tab', function() {
        it('should switch to preview tab status', function() {
            var magicItems = new MagicItemsViewModel();
            magicItems.selectPreviewTab();
            magicItems.previewTabStatus().should.equal('active');
            magicItems.editTabStatus().should.equal('');
        });
    });

    describe('Select Edit Tab', function() {
        it('should switch to edit tab status', function() {
            var magicItems = new MagicItemsViewModel();
            magicItems.selectEditTab();
            magicItems.editTabStatus().should.equal('active');
            magicItems.previewTabStatus().should.equal('');
        });
    });

    describe('Modal Finished Closing', function() {
        it('should switch default state to preview', function() {
            var magicItems = new MagicItemsViewModel();
            magicItems.selectEditTab();
            magicItems.modalFinishedClosing();
            magicItems.previewTabStatus().should.equal('active');
        });
    });

});
