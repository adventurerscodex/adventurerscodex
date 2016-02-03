"use strict";

describe('Armor', function() {
    describe('Clear', function() {
        it('should clear all the data in it', function() {
            var armor = new Armor();
            armor.armorName(ArmorFixture.armorName);
            armor.armorName().should.equal(ArmorFixture.armorName);
            armor.clear();
            armor.armorName().should.equal('');
        });
    });
});
