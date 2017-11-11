import { NPCSection } from 'charactersheet/models';
import simple from 'simple-mock';

describe('NPCSection', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save npcSection', function() {
            var npcSection = new NPCSection();
            var npcSectionSpy = simple.mock(npcSection.ps, 'save');

            npcSection.save();
            npcSectionSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete npcSection', function() {
            var npcSection = new NPCSection();
            var npcSectionSpy = simple.mock(npcSection.ps, 'delete', function() {});

            npcSection.delete();
            npcSectionSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear npcSection', function() {
            var npcSection = new NPCSection();
            npcSection.visible(true);

            npcSection.visible().should.equal(true);
            npcSection.clear();
            npcSection.visible().should.equal(false);
        });
    });

    describe('Import', function() {
        it('should import npcSection', function() {
            var npcSection = new NPCSection();

            npcSection.visible().should.equal(false);
            npcSection.importValues({'visible': true});
            npcSection.visible().should.equal(true);
        });
    });

    describe('Export', function() {
        it('should export npcSection', function() {
            var npcSection = new NPCSection();
            npcSection.visible(true);

            npcSection.visible().should.equal(true);
            var exported = npcSection.exportValues();
            exported.visible.should.equal(true);
        });
    });
});
