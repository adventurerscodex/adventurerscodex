'use strict';

import simple from 'simple-mock'

import { CharacterManager, Notifications } from 'charactersheet/utilities'
import { Items } from 'charactersheet/common/models'
import { ItemsViewModel } from 'charactersheet/common/models'
import { PersistenceService, SortService } from 'charactersheet/services/common'

describe('InventoryViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Instance Methods', function() {
        describe('Load', function() {
            it('should load items to the inventory', function() {
                simple.mock(PersistenceService, 'findBy').returnWith([new Item(), new Item()]);
                simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

                var p = new ItemsViewModel();
                p.items().length.should.equal(0);
                p.load();
                p.items().length.should.equal(2);
            });
        });

        describe('Unload', function() {
            it('should unload the data to the items db.', function() {
                simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

                var items = [new Item(), new Item()].map(function(e, i, _) {
                    e._spy = simple.mock(e, 'save');
                    return e;
                });

                var equipVM = new ItemsViewModel();
                equipVM.items(items);
                equipVM.unload();
                equipVM.items().length.should.equal(2);

                equipVM.items().forEach(function(e, i, _) {
                    e._spy.called.should.equal(true);
                });
            });
        });

        describe('Total Item Weight', function() {
            it('should return a string with the total weight of all items.', function() {
                simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
                var items = [new Item(), new Item()].map(function(e, i, _) {
                    e.itemWeight(5);
                    return e;
                });

                var p = new ItemsViewModel();
                p.totalItemWeight().should.equal('0 (lbs)');

                p = new ItemsViewModel();
                p.items(items);
                p.items().length.should.equal(2);
                p.totalItemWeight().should.equal('10 (lbs)');
            });
        });

        describe('Add Item', function() {
            it('should add a new item to the equipment', function() {
                simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

                var p = new ItemsViewModel();
                p.clear();
                p.items().length.should.equal(0);
                p.addItem(new Item());
                p.items().length.should.equal(1);
            });
        });

        describe('Edit Item', function() {
            it('should select a item for editing.', function() {
                simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

                var itemsVm = new ItemsViewModel();

                var item = new Item();
                item.itemName('Potion');
                itemsVm.editItem(item);
                itemsVm.currentEditItem().itemName().should.equal(item.itemName());
                itemsVm.modalOpen().should.equal(true);
            });
        });

        describe('Remove Item', function() {
            it('should remove a item from the equipment', function() {
                simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);

                var p = new ItemsViewModel();
                p.clear();
                p.items().length.should.equal(0);
                p.addItem(new Item());
                p.items().length.should.equal(1);
                p.removeItem(p.items()[0]);
                p.items().length.should.equal(0);
            });
        });

        describe('Clear', function() {
            it('should clear all the values in the equipment', function() {
                var p = new ItemsViewModel();
                var item = [new Item()];
                p.items(item);
                p.items().should.equal(item);
                p.clear();
                p.items().length.should.equal(0);
            });
        });
        describe('Sort By', function() {
            it('should sort the list of spells by given criteria', function() {
                var eq = new ItemsViewModel();
                eq.sortBy('itemName');
                eq.sort().should.equal(eq.sorts['itemName desc']);
                eq.sortBy('itemName');
                eq.sort().should.equal(eq.sorts['itemName asc']);
                eq.sortBy('itemWeight');
                eq.sort().should.equal(eq.sorts['itemWeight asc']);
                eq.sortBy('itemWeight');
                eq.sort().should.equal(eq.sorts['itemWeight desc']);
            });
        });

        describe('Sort Arrow', function() {
            it('should sort the list of skills by given criteria', function() {
                var eq = new ItemsViewModel();
                eq.sortBy('itemName');
                eq.sort().should.equal(eq.sorts['itemName desc']);
                eq.sortArrow('itemName').should.equal('fa fa-arrow-down fa-color');
                eq.sortArrow('itemWeight').should.equal('');
                eq.sortBy('itemName');
                eq.sort().should.equal(eq.sorts['itemName asc']);
                eq.sortArrow('itemName').should.equal('fa fa-arrow-up fa-color');
                eq.sortArrow('itemWeight').should.equal('');
                //Numeric sort
                eq.sortBy('itemWeight');
                eq.sort().should.equal(eq.sorts['itemWeight asc']);
                eq.sortArrow('itemName').should.equal('');
                eq.sortArrow('itemWeight').should.equal('fa fa-arrow-up fa-color');
                eq.sortBy('itemWeight');
                eq.sort().should.equal(eq.sorts['itemWeight desc']);
                eq.sortArrow('itemName').should.equal('');
                eq.sortArrow('itemWeight').should.equal('fa fa-arrow-down fa-color');
            });
        });

        describe('Select Preview Tab', function() {
            it('should switch to preview tab status', function() {
                var items = new ItemsViewModel();
                items.selectPreviewTab();
                items.previewTabStatus().should.equal('active');
                items.editTabStatus().should.equal('');
            });
        });

        describe('Select Edit Tab', function() {
            it('should switch to edit tab status', function() {
                var items = new ItemsViewModel();
                items.selectEditTab();
                items.editTabStatus().should.equal('active');
                items.previewTabStatus().should.equal('');
            });
        });

        describe('Modal Finished Closing', function() {
            it('should switch default state to preview', function() {
                var items = new ItemsViewModel();
                items.selectEditTab();
                items.modalFinishedClosing();
                items.previewTabStatus().should.equal('active');
            });
        });
    });
});
