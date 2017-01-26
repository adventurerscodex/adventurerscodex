'use strict';

describe('Slot Model', function() {
    describe('Spell Slots', function() {
        it('should yield the number of total slots remaining.', function() {
            var s = new Slot();
            s.maxSpellSlots(4);
            s.usedSpellSlots(1);
            s.spellSlots().should.equal(3);
        });
    });

    describe('Clear', function() {
        it('should clear all values', function() {
            var s = new Slot();
            s.level(10);
            s.maxSpellSlots(4);
            s.usedSpellSlots(1);

            s.level().should.equal(10);
            s.maxSpellSlots().should.equal(4);
            s.usedSpellSlots().should.equal(1);
            s.clear();
            s.level().should.equal(1);
            Should.not.exist(s.maxSpellSlots());
            s.usedSpellSlots().should.equal(0);
        });
    });

    describe('Export', function() {
        it('should yield an object with all the info supplied.', function() {
            var p = new Slot();
            p.level(10);
            p.maxSpellSlots(10);
            p.usedSpellSlots(10);

            p.level().should.equal(10);
            p.maxSpellSlots().should.equal(10);
            p.usedSpellSlots().should.equal(10);
            var e = p.exportValues();
            e.level.should.equal(10);
            e.maxSpellSlots.should.equal(10);
            e.usedSpellSlots.should.equal(10);
        });
    });

    describe('Import', function() {
        it('should import an object with all the info supplied.', function() {
            var slot = new Slot();
            slot.maxSpellSlots(0);
            slot.usedSpellSlots(0);

            var vals = { level: 10, maxSpellSlots: 3, usedSpellSlots: 1 };
            slot.importValues(vals);
            slot.level().should.equal(vals.level);
            slot.usedSpellSlots().should.equal(vals.usedSpellSlots);
            slot.maxSpellSlots().should.equal(vals.maxSpellSlots);
        });
    });
});
