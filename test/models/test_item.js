'use strict';

describe('Item Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save the values.', function() {
            var ft = new Item();
            var saved = false;
            ft.ps.save = function() { saved = true; };

            saved.should.equal(false);
            ft.save();
            saved.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var ft = new Item();
            ft.itemName('something something');
            ft.itemName().should.equal('something something');
            ft.clear();
            ft.itemName().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var ft = new Item();
            var e = {
                itemName: 'something something'
            };
            ft.itemName().should.equal('');
            ft.importValues(e);
            ft.itemName().should.equal(e.itemName);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var ft = new Item();
            ft.itemName('something something');
            ft.itemName().should.equal('something something');
            var e = ft.exportValues();
            ft.itemName().should.equal(e.itemName);
        });
    });

    describe('Find All', function() {
        it('should find all of the values in the db.', function() {
            var key = '1234';
            simple.mock(PersistenceService, 'findAll').returnWith([new Item(), new Item()]);
            var r = Item.findAllBy(key);
            r.length.should.equal(0);


            simple.mock(PersistenceService, 'findAll').returnWith([new Item(), new Item()].map(function(e, i, _) {
                e.characterId(key);
                return e;
            }));
            r = Item.findAllBy(key);
            r.length.should.equal(2);
        });
    });

    describe('Item Weight Label', function() {
        it('should return the correct label', function() {
            var item = new Item();
            item.itemWeight(10);
            item.itemWeightLabel().should.equal('10 lbs.');
        });
    });

    describe('Item Description Label', function() {
        it('should return the correct label', function() {
            var item = new Item();
            item.itemDesc('This thing is cool.\n');
            item.itemDescriptionHTML().should.equal('This thing is cool.<br />');
        });
    });

});

