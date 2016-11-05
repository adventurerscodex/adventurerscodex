'use strict';

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

    describe('Armor Weight Label', function() {
        it('should return the correct label', function() {
            var armor = new Armor();
            armor.armorWeight(10);
            armor.armorWeightLabel().should.equal('10 lbs.');
        });
    });

    describe('Armor AC Label', function() {
        it('should return the correct label', function() {
            var armor = new Armor();
            armor.armorClass('15');
            armor.acLabel().should.equal('AC 15');
        });
    });

    describe('Armor Description Label', function() {
        it('should return the correct label', function() {
            var armor = new Armor();
            armor.armorDescription('This thing is cool.\n');
            armor.armorDescriptionHTML().should.equal('This thing is cool.<br />');

            var armor2 = new Armor();
            armor2.armorDescription('');
            armor2.armorDescriptionHTML().should.equal(
                '<div class="h3"><small>Add a description via the edit tab.</small></div>');
        });
    });
});
