describe('PointOfInterestSection', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save pointOfInterestSection', function() {
            var pointOfInterestSection = new PointOfInterestSection();
            var pointOfInterestSectionSpy = simple.mock(pointOfInterestSection.ps, 'save');

            pointOfInterestSection.save();
            pointOfInterestSectionSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete pointOfInterestSection', function() {
            var pointOfInterestSection = new PointOfInterestSection();
            var pointOfInterestSectionSpy = simple.mock(pointOfInterestSection.ps, 'delete');

            pointOfInterestSection.delete();
            pointOfInterestSectionSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear pointOfInterestSection', function() {
            var pointOfInterestSection = new PointOfInterestSection();
            pointOfInterestSection.visible(true);

            pointOfInterestSection.visible().should.equal(true);
            pointOfInterestSection.clear();
            pointOfInterestSection.visible().should.equal(false);
        });
    });

    describe('Import', function() {
        it('should import pointOfInterestSection', function() {
            var pointOfInterestSection = new PointOfInterestSection();

            pointOfInterestSection.visible().should.equal(false);
            pointOfInterestSection.importValues({"visible": true});
            pointOfInterestSection.visible().should.equal(true);
        });
    });

    describe('Export', function() {
        it('should export pointOfInterestSection', function() {
            var pointOfInterestSection = new PointOfInterestSection();
            pointOfInterestSection.visible(true);

            pointOfInterestSection.visible().should.equal(true);
            var exported = pointOfInterestSection.exportValues();
            exported.visible.should.equal(true);
        });
    });
});
