"use strict";

describe('Armor Model', function() {
    describe('Clear', function() {
        it('should clear all the data in it', function() {
            var armor = new Armor();
            armor.armorName(ArmorFixture.armorName);
            armor.armorName().should.equal(ArmorFixture.armorName);
            armor.clear();
            armor.armorName().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import all the data from a fixture', function() {
            var armor = new Armor();
            armor.importValues(ArmorFixture);
            armor.armorName().should.equal(ArmorFixture.armorName);
        });
    });

    describe('Export', function() {
        it('should export all the data from a fixture', function() {
            var armor = new Armor();
            armor.importValues(ArmorFixture);
            armor.armorName().should.equal(ArmorFixture.armorName);
            armor.exportValues().armorName.should.equal(ArmorFixture.armorName);
        });
    });

    describe('Proficiency Label', function() {
        it('', function() {
            var armor = new Armor();
            armor.armorProficiency(true);
            armor.proficiencyLabel().should.equal('fa fa-check');
            armor.clear();
            armor.proficiencyLabel().should.equal('');
        });
    });
});
