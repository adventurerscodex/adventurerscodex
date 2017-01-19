'use strict';

describe('Features and Traits Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });
    
    var vals = {
        'background':'A background',
        'ideals':'LOTS OF THEM',
        'flaws':'not too many',
        'bonds':'yes'
    };

    describe('Save', function() {
        it('should save the values.', function() {
            var ft = new FeaturesTraits();
            var saved = false;
            ft.ps.save = function() { saved = true; };

            saved.should.equal(false);
            ft.save();
            saved.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear the values.', function() {
            var ft = new FeaturesTraits();
            ft.background('something something');
            ft.background().should.equal('something something');
            ft.clear();
            ft.background().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import the values.', function() {
            var ft = new FeaturesTraits();
            var e = {
                background: 'something something'
            };
            ft.background().should.equal('');
            ft.importValues(e);
            ft.background().should.equal(e.background);
        });
    });

    describe('Export', function() {
        it('should export the values.', function() {
            var ft = new FeaturesTraits();
            ft.background('something something');
            ft.background().should.equal('something something');
            var e = ft.exportValues();
            ft.background().should.equal(e.background);
        });
    });
});
