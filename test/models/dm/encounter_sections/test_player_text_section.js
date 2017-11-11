import { PlayerTextSection } from 'charactersheet/models';
import simple from 'simple-mock';

describe('PlayerTextSection', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save playerTextSection', function() {
            var playerTextSection = new PlayerTextSection();
            var playerTextSectionSpy = simple.mock(playerTextSection.ps, 'save');

            playerTextSection.save();
            playerTextSectionSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete playerTextSection', function() {
            var playerTextSection = new PlayerTextSection();
            var playerTextSectionSpy = simple.mock(playerTextSection.ps, 'delete', function() {});

            playerTextSection.delete();
            playerTextSectionSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear playerTextSection', function() {
            var playerTextSection = new PlayerTextSection();
            playerTextSection.visible(false);

            playerTextSection.visible().should.equal(false);
            playerTextSection.clear();
            playerTextSection.visible().should.equal(true);
        });
    });

    describe('Import', function() {
        it('should import playerTextSection', function() {
            var playerTextSection = new PlayerTextSection();

            playerTextSection.visible().should.equal(true);
            playerTextSection.importValues({'visible': false});
            playerTextSection.visible().should.equal(false);
        });
    });

    describe('Export', function() {
        it('should export playerTextSection', function() {
            var playerTextSection = new PlayerTextSection();
            playerTextSection.visible(true);

            playerTextSection.visible().should.equal(true);
            var exported = playerTextSection.exportValues();
            exported.visible.should.equal(true);
        });
    });
});
