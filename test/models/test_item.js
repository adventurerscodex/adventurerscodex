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

    describe('Item Weight Label', function() {
        it('should return the correct label', function() {
            var item = new Item();
            item.itemWeight(10);
            item.itemWeightLabel().should.equal('10 lbs.');
        });
        it('should return the correct label', function() {
            var item = new Item();
            item.itemWeight(0);
            item.itemWeightLabel().should.equal('0 lbs.');
        });
        it('should return the correct label', function() {
            var item = new Item();
            item.itemWeight('');
            item.itemWeightLabel().should.equal('0 lbs.');
        });
    });

    describe('Item Description Label', function() {
        it('should return the correct label', function() {
            var item = new Item();
            item.itemDesc('This thing is cool.\n');
            item.itemDescriptionHTML().should.equal('This thing is cool.<br />');

            var item2 = new Item();
            item2.itemDesc('');
            item2.itemDescriptionHTML().should.equal(
                '<div class="h3"><small>Add a description via the edit tab.</small></div>');
        });
    });

});

