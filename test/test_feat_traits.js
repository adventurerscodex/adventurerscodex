var vals = {
	"background":"A background",
	"ideals":"LOTS OF THEM",
	"flaws":"not too many",
	"bonds":"yes"
};


describe('FeaturesTraitsViewModel', function() {
	describe('Clear', function() {
		it('should clear all the valsues in ft', function() {
			var p = new FeaturesTraitsViewModel();
			p.background(vals.background);
			p.background().should.equal(vals.background);
			p.clear();
			p.background().should.equal('');
		});
	});

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var p = new FeaturesTraitsViewModel();
			p.background(vals.background);
			p.ideals(vals.ideals);
			p.bonds(vals.bonds);
			p.flaws(vals.flaws);		
			var a = p.exportValues();
			a.background.should.equal(p.background());
			a.ideals.should.equal(p.ideals());
			a.flaws.should.equal(p.flaws());
			a.bonds.should.equal(p.bonds());
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var p = new FeaturesTraitsViewModel();
			p.importValues(vals);
			p.background().should.equal(vals.background);
			p.flaws().should.equal(vals.flaws);
			p.bonds().should.equal(vals.bonds);
			p.ideals().should.equal(vals.ideals);			
		});
	});
});

