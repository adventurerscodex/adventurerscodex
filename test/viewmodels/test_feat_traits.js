'use strict';

describe('Features and Traits View Model', function() {

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

    describe('Find All', function() {
        it('should find all of the values in the db.', function() {
            var key = '1234';
            var _findAll = PersistenceService.findAll;

            PersistenceService.findAll = function(_) { return [new FeaturesTraits(), new FeaturesTraits()]; };
            var r = FeaturesTraits.findBy(key);
            r.length.should.equal(0);


            var results = [new FeaturesTraits(), new FeaturesTraits()].map(function(e, i, _) {
                e.characterId(key);
                return e;
            });
            PersistenceService.findAll = function(_) { return results; };
            r = FeaturesTraits.findBy(key);
            r.length.should.equal(2);

            PersistenceService.findAll = _findAll;
        });
    });
});

