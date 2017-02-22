'use strict';

describe('NPC', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('shortDescription', function() {
        it('should return short description', function() {
            var npc = new NPC();
            npc.description('blah');
            simple.mock(Utility.markdown, 'asPlaintext').returnWith('blah');

            var description = npc.shortDescription();
            description.should.equal('blah');
        });
    });

    describe('longDescription', function() {
        it('should return long description', function() {
            var npc = new NPC();
            npc.description('blah');
            simple.mock(Utility.markdown, 'asPlaintext').returnWith('blah');

            var description = npc.longDescription();
            description.should.equal('blah');
        });
    });

    describe('Save', function() {
        it('should save npc', function() {
            var npc = new NPC();
            var npcSpy = simple.mock(npc.ps, 'save');

            npc.save();
            npcSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete npc', function() {
            var npc = new NPC();
            var npcSpy = simple.mock(npc.ps, 'delete');

            npc.delete();
            npcSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear npc', function() {
            var npc = new NPC();
            npc.description('blah');

            npc.description().should.equal('blah');
            npc.clear();
            Should.not.exist(npc.description());
        });
    });

    describe('Import', function() {
        it('should import npc', function() {
            var npc = new NPC();

            Should.not.exist(npc.description());
            npc.importValues({"description": 'blah'});
            npc.description().should.equal('blah');
        });
    });

    describe('Export', function() {
        it('should export npc', function() {
            var npc = new NPC();
            npc.description('blah');

            npc.description().should.equal('blah');
            var exported = npc.exportValues();
            exported.description.should.equal('blah');
        });
    });
});
