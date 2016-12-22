'use strict';

describe('MonsterSection', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Save', function() {
        it('should save monsterSection', function() {
            var monsterSection = new MonsterSection();
            var monsterSectionSpy = simple.mock(monsterSection.ps, 'save');

            monsterSection.save();
            monsterSectionSpy.called.should.equal(true);
        });
    });

    describe('Delete', function() {
        it('should delete monsterSection', function() {
            var monsterSection = new MonsterSection();
            var monsterSectionSpy = simple.mock(monsterSection.ps, 'delete');

            monsterSection.delete();
            monsterSectionSpy.called.should.equal(true);
        });
    });

    describe('Clear', function() {
        it('should clear monsterSection', function() {
            var monsterSection = new MonsterSection();
            monsterSection.visible(true);

            monsterSection.visible().should.equal(true);
            monsterSection.clear();
            monsterSection.visible().should.equal(false);
        });
    });

    describe('Import', function() {
        it('should import monsterSection', function() {
            var monsterSection = new MonsterSection();

            monsterSection.visible().should.equal(false);
            monsterSection.importValues({"visible": true});
            monsterSection.visible().should.equal(true);
        });
    });

    describe('Export', function() {
        it('should export monsterSection', function() {
            var monsterSection = new MonsterSection();
            monsterSection.visible(true);

            monsterSection.visible().should.equal(true);
            var exported = monsterSection.exportValues();
            exported.visible.should.equal(true);
        });
    });
});
