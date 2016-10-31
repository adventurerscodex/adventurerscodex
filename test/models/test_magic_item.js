'use strict';

describe('Magic Item Model', function() {
    describe('Clear', function() {
        it('should clear all the data in it', function() {
            var magicItem = new MagicItem();
            magicItem.magicItemName(MagicItemFixture.magicItemName);
            magicItem.magicItemName().should.equal(MagicItemFixture.magicItemName);
            magicItem.clear();
            magicItem.magicItemName().should.equal('');

            magicItem.magicItemType(MagicItemFixture.magicItemType);
            magicItem.magicItemType().should.equal(MagicItemFixture.magicItemType);
            magicItem.clear();
            magicItem.magicItemType().should.equal('');

            magicItem.magicItemRarity(MagicItemFixture.magicItemRarity);
            magicItem.magicItemRarity().should.equal(MagicItemFixture.magicItemRarity);
            magicItem.clear();
            magicItem.magicItemRarity().should.equal('');

            magicItem.magicItemRequiresAttunement(MagicItemFixture.magicItemRequiresAttunement);
            magicItem.magicItemRequiresAttunement().should.equal(MagicItemFixture.magicItemRequiresAttunement);
            magicItem.clear();
            magicItem.magicItemRequiresAttunement().should.equal(false);

            magicItem.magicItemAttuned(MagicItemFixture.magicItemAttuned);
            magicItem.magicItemAttuned().should.equal(MagicItemFixture.magicItemAttuned);
            magicItem.clear();
            magicItem.magicItemAttuned().should.equal(false);

            magicItem.magicItemMaxCharges(MagicItemFixture.magicItemMaxCharges);
            magicItem.magicItemMaxCharges().should.equal(MagicItemFixture.magicItemMaxCharges);
            magicItem.clear();
            magicItem.magicItemMaxCharges().should.equal(0);

            magicItem.magicItemCharges(MagicItemFixture.magicItemCharges);
            magicItem.magicItemCharges().should.equal(MagicItemFixture.magicItemCharges);
            magicItem.clear();
            magicItem.magicItemCharges().should.equal(0);

            magicItem.magicItemWeight(MagicItemFixture.magicItemWeight);
            magicItem.magicItemWeight().should.equal(MagicItemFixture.magicItemWeight);
            magicItem.clear();
            magicItem.magicItemWeight().should.equal(0);

            magicItem.magicItemDescription(MagicItemFixture.magicItemDescription);
            magicItem.magicItemDescription().should.equal(MagicItemFixture.magicItemDescription);
            magicItem.clear();
            magicItem.magicItemDescription().should.equal('');
        });
    });

    describe('Import', function() {
        it('should import all the data from a fixture', function() {
            var magicItem = new MagicItem();
            magicItem.importValues(MagicItemFixture);
            magicItem.magicItemName().should.equal(MagicItemFixture.magicItemName);
            magicItem.magicItemType().should.equal(MagicItemFixture.magicItemType);
            magicItem.magicItemRarity().should.equal(MagicItemFixture.magicItemRarity);
            magicItem.magicItemRequiresAttunement().should.equal(MagicItemFixture.magicItemRequiresAttunement);
            magicItem.magicItemAttuned().should.equal(MagicItemFixture.magicItemAttuned);
            magicItem.magicItemMaxCharges().should.equal(MagicItemFixture.magicItemMaxCharges);
            magicItem.magicItemCharges().should.equal(MagicItemFixture.magicItemCharges);
            magicItem.magicItemWeight().should.equal(MagicItemFixture.magicItemWeight);
            magicItem.magicItemDescription().should.equal(MagicItemFixture.magicItemDescription);
        });
    });

    describe('Export', function() {
        it('should Export all the data from a fixture', function() {
            var magicItem = new MagicItem();
            magicItem.importValues(MagicItemFixture);

            magicItem.magicItemName().should.equal(MagicItemFixture.magicItemName);
            magicItem.exportValues().magicItemName.should.equal(MagicItemFixture.magicItemName);

            magicItem.magicItemType().should.equal(MagicItemFixture.magicItemType);
            magicItem.exportValues().magicItemType.should.equal(MagicItemFixture.magicItemType);

            magicItem.magicItemRarity().should.equal(MagicItemFixture.magicItemRarity);
            magicItem.exportValues().magicItemRarity.should.equal(MagicItemFixture.magicItemRarity);

            magicItem.magicItemRequiresAttunement().should.equal(MagicItemFixture.magicItemRequiresAttunement);
            magicItem.exportValues().magicItemRequiresAttunement.should.equal(MagicItemFixture.magicItemRequiresAttunement);

            magicItem.magicItemAttuned().should.equal(MagicItemFixture.magicItemAttuned);
            magicItem.exportValues().magicItemAttuned.should.equal(MagicItemFixture.magicItemAttuned);

            magicItem.magicItemMaxCharges().should.equal(MagicItemFixture.magicItemMaxCharges);
            magicItem.exportValues().magicItemMaxCharges.should.equal(MagicItemFixture.magicItemMaxCharges);

            magicItem.magicItemCharges().should.equal(MagicItemFixture.magicItemCharges);
            magicItem.exportValues().magicItemCharges.should.equal(MagicItemFixture.magicItemCharges);

            magicItem.magicItemWeight().should.equal(MagicItemFixture.magicItemWeight);
            magicItem.exportValues().magicItemWeight.should.equal(MagicItemFixture.magicItemWeight);

            magicItem.magicItemDescription().should.equal(MagicItemFixture.magicItemDescription);
            magicItem.exportValues().magicItemDescription.should.equal(MagicItemFixture.magicItemDescription);
        });
    });

    describe('Magic Item Weight Label', function() {
        it('should return the correct label', function() {
            var magicItem = new MagicItem();
            magicItem.magicItemWeight(10);
            magicItem.magicItemWeightLabel().should.equal('10 lbs.');
        });
    });

    describe('Magic Item Description Label', function() {
        it('should return the correct label', function() {
            var magicItem = new MagicItem();
            magicItem.magicItemDescription('This thing is cool.\n');
            magicItem.magicItemDescriptionHTML().should.equal('This thing is cool.<br />');
        });
    });

    describe('Magic Item Name Label', function() {
        it('should return the correct label', function() {
            var magicItem = new MagicItem();
            magicItem.magicItemName('Staff of the Python');
            magicItem.magicItemAttuned(true);
            magicItem.magicItemNameLabel().should.equal('Staff of the Python (Attuned)');

            var magicItemNotAttuned = new MagicItem();
            magicItemNotAttuned.magicItemName('Dragon Slayer');
            magicItemNotAttuned.magicItemAttuned(false);
            magicItemNotAttuned.magicItemNameLabel().should.equal('Dragon Slayer');
        });
    });

});