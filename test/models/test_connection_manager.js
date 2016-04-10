"use strict";

describe('Connection Manager Model', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

	describe('Save', function() {
		it('should save the values.', function() {
			var ft = new ConnectionManager();
			var saved = false;
			ft.ps.save = function() { saved = true; };

			saved.should.equal(false);
			ft.save();
			saved.should.equal(true);
		});
	});

	describe('Clear', function() {
		it('should clear the values.', function() {
			var ft = new ConnectionManager();
			ft.connected(true);
			ft.connected().should.equal(true);
			ft.clear();
			ft.connected().should.equal(false);
		});
	});

	describe('Import', function() {
		it('should import the values.', function() {
			var ft = new ConnectionManager();
			var e = {
				connected: true
			};
			ft.connected().should.equal(false);
			ft.importValues(e);
			ft.connected().should.equal(e.connected);
		});
	});

	describe('Export', function() {
		it('should export the values.', function() {
			var ft = new ConnectionManager();
			ft.connected(true);
			ft.connected().should.equal(true);
			var e = ft.exportValues();
			ft.connected().should.equal(e.connected);
		});
	});

  describe('Delete', function() {
    it('should delete the objects.', function() {
      var ft = new ConnectionManager();
      var deleted = false;
      ft.ps.delete = function() { deleted = true; };

      deleted.should.equal(false);
      ft.delete();
      deleted.should.equal(true);
    });
  });

  describe('FindBy', function() {
		it('should find the other stats module from the db.', function() {
			var key = '1234';
			simple.mock(PersistenceService, 'findAll').returnWith([new ConnectionManager()]);
			var r = ConnectionManager.findBy(key);
			r.length.should.equal(0);

			simple.mock(PersistenceService, 'findAll').returnWith([new ConnectionManager()].map(function(e, i, _) {
				e.characterId(key);
				return e;
			}));
			var r = ConnectionManager.findBy(key);
			r.length.should.equal(1);

		});
	});
});
