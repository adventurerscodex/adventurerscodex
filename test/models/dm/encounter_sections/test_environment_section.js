import { EnvironmentSection } from 'charactersheet/models';
import simple from 'simple-mock';

describe('EnvironmentSection', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save environmentSection', function() {
            var environmentSection = new EnvironmentSection();
            var environmentSectionSpy = simple.mock(environmentSection.ps, 'save');

            environmentSection.save();
            environmentSectionSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete environmentSection', function() {
            var environmentSection = new EnvironmentSection();
            var environmentSectionSpy = simple.mock(environmentSection.ps, 'delete', function() {});

            environmentSection.delete();
            environmentSectionSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear environmentSection', function() {
            var environmentSection = new EnvironmentSection();
            environmentSection.visible(true);

            environmentSection.visible().should.equal(true);
            environmentSection.clear();
            environmentSection.visible().should.equal(false);
        });
    });

    describe('Import', function() {
        it('should import environmentSection', function() {
            var environmentSection = new EnvironmentSection();

            environmentSection.visible().should.equal(false);
            environmentSection.importValues({'visible': true});
            environmentSection.visible().should.equal(true);
        });
    });

    describe('Export', function() {
        it('should export environmentSection', function() {
            var environmentSection = new EnvironmentSection();
            environmentSection.visible(true);

            environmentSection.visible().should.equal(true);
            var exported = environmentSection.exportValues();
            exported.visible.should.equal(true);
        });
    });
});
