describe('TreasureSection', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save treasureSection', function() {
            var treasureSection = new TreasureSection();
            var treasureSectionSpy = simple.mock(treasureSection.ps, 'save');

            treasureSection.save();
            treasureSectionSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete treasureSection', function() {
            var treasureSection = new TreasureSection();
            var treasureSectionSpy = simple.mock(treasureSection.ps, 'delete');

            treasureSection.delete();
            treasureSectionSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear treasureSection', function() {
            var treasureSection = new TreasureSection();
            treasureSection.visible(true);

            treasureSection.visible().should.equal(true);
            treasureSection.clear();
            treasureSection.visible().should.equal(false);
        });
    });

    describe('Import', function() {
        it('should import treasureSection', function() {
            var treasureSection = new TreasureSection();

            treasureSection.visible().should.equal(false);
            treasureSection.importValues({"visible": true});
            treasureSection.visible().should.equal(true);
        });
    });

    describe('Export', function() {
        it('should export treasureSection', function() {
            var treasureSection = new TreasureSection();
            treasureSection.visible(true);

            treasureSection.visible().should.equal(true);
            var exported = treasureSection.exportValues();
            exported.visible.should.equal(true);
        });
    });
});
