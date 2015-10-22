"use strict";


describe('AppearanceViewModel', function() {
	var appval = {
		appearance: {
			"height":"5'1\"",
			"weight":"123",
			"hairColor":"Brown",
			"eyeColor":"Blue",
			"skinColor":"Red"
		}
	};
	describe('Clear', function() {
		it('should clear all the values', function() {
			var p = new AppearanceViewModel();
			p.appearance().height('Bob');
			p.appearance().height().should.equal('Bob');
			p.clear();
			p.appearance().height().should.equal('');
		});
	});

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var p = new AppearanceViewModel();
			p.appearance().height('Bob');
			p.appearance().weight('fsddssd');
			p.appearance().skinColor('fdsdsf');
			var a = p.exportValues();
			p.appearance().height().should.equal(a.appearance.height);
			p.appearance().weight().should.equal(a.appearance.weight);
			p.appearance().skinColor().should.equal(a.appearance.skinColor);
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var p = new AppearanceViewModel();
			p.importValues(appval);
			p.appearance().height().should.equal(appval.appearance.height);
			p.appearance().weight().should.equal(appval.appearance.weight);
			p.appearance().skinColor().should.equal(appval.appearance.skinColor);
		});
	});
});

