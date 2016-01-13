"use strict";

describe('Other Stats', function() {
	describe('Clear', function() {
		it('should clear all the values in stats', function() {
			var os = new OtherStats();
			os.ac(20);
			os.ac().should.equal(20);
			os.clear();
			os.ac().should.equal(10);
		});
	});
	
	describe('Import', function() {
		it('should import all the values in other stats', function() {
			var os = new OtherStats();
			os.ac(20);
			os.initiative(-23);
			os.speed(20);
			
			var e = os.exportValues();
			e.ac.should.equal(20);
			e.initiative.should.equal(-23);
			e.speed.should.equal(20);
			
			var os2 = new OtherStats();
			os2.importValues(e);
			e.ac.should.equal(20);
			e.initiative.should.equal(-23);
			e.speed.should.equal(20);
						
		});
	});
	
	describe('Export', function() {
		it('should export all the values in other stats', function() {
			var os = new OtherStats();
			os.ac(20);
			os.initiative(-23);
			os.speed(20);
			
			var e = os.exportValues();
			e.ac.should.equal(20);
			e.initiative.should.equal(-23);
			e.speed.should.equal(20);
		});
	});
	
	describe('Save', function() {
		it('should save the values to the local store', function() {
			var os = new OtherStats();
			var saved = false;
			os.ps.save = function() { saved = true; }
			saved.should.equal(false);
			
			os.save();
			saved.should.equal(true);
		});
	});
	
	describe('FindBy', function() {
		it('should find the other stats module from the db.', function() {
			var key = '1234';
			var _findAll = PersistenceService.findAll;
		
			PersistenceService.findAll = function(_) { return [new OtherStats()]; };
			var r = OtherStats.findBy(key);
			r.length.should.equal(0);

			
			var results = [new OtherStats()].map(function(e, i, _) {
				e.characterId(key);
				return e;
			});
			
			PersistenceService.findAll = function(_) { return results; };
			var r = AbilityScores.findBy(key);
			r.length.should.equal(1);
			
			PersistenceService.findAll = _findAll;			
		});
	});

});
