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

    describe('Armor Weight Label', function() {
        it('should return the correct label', function() {
            var armor = new Armor();
            armor.armorWeight(10);
            armor.armorWeightLabel().should.equal('10 lbs.');
        });
    });

    describe('Armor Equipped Label', function() {
        it('should return the correct label', function() {
            var armor = new Armor();
            armor.armorEquipped(true);
            armor.armorEquippedLabel().should.equal('fa fa-check');
        });

        it('should return the correct label', function() {
            var armor = new Armor();
            armor.armorEquipped(false);
            armor.armorEquippedLabel().should.equal('');
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

    describe('Apply Magical Modifier Label', function() {
        it('should return true if there is a magicalModifierLabel', function() {
            var armor = new Armor();
            armor.armorMagicalModifier(2);

            armor.applyMagicalModifierLabel().should.equal(true);
        });
        it('should return false if there is on magicalModifierLabel', function() {
            var armor = new Armor();
            armor.armorMagicalModifier(0);

            armor.applyMagicalModifierLabel().should.equal(false);
        });
    });

    describe('Magical Modifier Label', function() {
        it('should return a label of magical modifier', function() {
            var armor = new Armor();
            armor.armorMagicalModifier(2);

            armor.magicalModifierLabel().should.equal('+ 2');
        });
        it('should return a label of magical modifier', function() {
            var armor = new Armor();
            armor.armorMagicalModifier(-2);

            armor.magicalModifierLabel().should.equal('- 2');
        });
        it('should return a label of magical modifier', function() {
            var armor = new Armor();
            armor.armorMagicalModifier(0);

            armor.magicalModifierLabel().should.equal('');
        });
    });

    describe('Armor Summary Label', function() {
        it('should return a summary label', function() {
            var armor = new Armor();
            armor.armorMagicalModifier(2);
            armor.armorClass(14);

            armor.armorSummaryLabel().should.equal('+ 2, AC 14');
        });
        it('should return a summary label', function() {
            var armor = new Armor();
            armor.armorMagicalModifier(-2);
            armor.armorClass(14);

            armor.armorSummaryLabel().should.equal('- 2, AC 14');
        });
        it('should return a summary label', function() {
            var armor = new Armor();
            armor.armorMagicalModifier(0);
            armor.armorClass(14);

            armor.armorSummaryLabel().should.equal('AC 14');
        });
    });
});
