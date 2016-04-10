"use strict";

describe('Features Traits Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

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
			ft.background('some background');
			ft.background().should.equal('some background');
			ft.clear();
			ft.background().should.equal('');
		});
	});

	describe('Import', function() {
		it('should import the values.', function() {
			var ft = new FeaturesTraits();
			var e = {
				background: 'some background'
			};
			ft.background().should.equal('');
			ft.importValues(e);
			ft.background().should.equal(e.background);
		});
	});

	describe('Export', function() {
		it('should export the values.', function() {
			var ft = new FeaturesTraits();
			ft.background('some background');
			ft.background().should.equal('some background');
			var e = ft.exportValues();
			ft.background().should.equal(e.background);
		});
	});

	describe('Find By', function() {
		it('should find all of the values in the db.', function() {
			var key = '1234';
			simple.mock(PersistenceService, 'findAll').returnWith([new FeaturesTraits()]);
			var r = FeaturesTraits.findBy(key);
			r.length.should.equal(0);


			simple.mock(PersistenceService, 'findAll').returnWith([new FeaturesTraits()].map(function(e, i, _) {
				e.characterId(key);
				return e;
			}));
			var r = FeaturesTraits.findBy(key);
			r.length.should.equal(1);
		});
	});
});
