"use strict";


describe('AppearanceViewModel', function() {
	var appval = {
			"height":"5'1\"",
			"weight":"123",
			"hairColor":"Brown",
			"eyeColor":"Blue",
			"skinColor":"Red"
	};
	describe('Clear', function() {
		it('should clear all the values', function() {
			var p = new AppearanceViewModel();
			p.appearance.height('Bob');
			p.appearance.height().should.equal('Bob');
			p.clear();
			p.appearance.height().should.equal('');
		});
	});

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var p = new AppearanceViewModel();
			p.appearance.height('Bob');
			p.appearance.weight('fsddssd');
			p.appearance.skinColor('fdsdsf');
			var a = p.appearance.exportValues();
			p.appearance.height().should.equal(a.height);
			p.appearance.weight().should.equal(a.weight);
			p.appearance.skinColor().should.equal(a.skinColor);
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var p = new AppearanceViewModel();
			p.appearance.importValues(appval);
			p.appearance.height().should.equal(appval.height);
			p.appearance.weight().should.equal(appval.weight);
			p.appearance.skinColor().should.equal(appval.skinColor);
		});
	});
});

