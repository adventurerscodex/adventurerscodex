'use strict';

describe('Spell Slots View Model', function() {
    describe('Add Slots', function() {
        it('should add a new slot to the list of slots', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new SpellSlotsViewModel();
            p.slots().length.should.equal(0);
            p.addSlot();
            p.slots().length.should.equal(1);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Remove Slot', function() {
        it('should remove a slot from the list of slots', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new SpellSlotsViewModel();
            p.slots().length.should.equal(0);
            p.addSlot();
            p.slots().length.should.equal(1);
            p.removeSlot(p.slots().pop());
            p.slots().length.should.equal(0);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Sort By', function() {
        it('should sort the list of slots by given criteria', function() {
            var p = new SpellSlotsViewModel();
            p.sortBy('level');
            p.sort().should.equal(p.sorts['level desc']);
            p.sortBy('level');
            p.sort().should.equal(p.sorts['level asc']);
            p.sortBy('maxSpellSlots');
            p.sort().should.equal(p.sorts['maxSpellSlots asc']);
            p.sortBy('maxSpellSlots');
            p.sort().should.equal(p.sorts['maxSpellSlots desc']);
        });
    });

    describe('Sort Arrow', function() {
        it('should sort the list of slots by given criteria', function() {
            var p = new SpellSlotsViewModel();
            p.sortBy('level');
            p.sort().should.equal(p.sorts['level desc']);
            p.sortArrow('level').should.equal('fa fa-arrow-down fa-color');
            p.sortArrow('maxSpellSlots').should.equal('');
            p.sortBy('level');
            p.sort().should.equal(p.sorts['level asc']);
            p.sortArrow('level').should.equal('fa fa-arrow-up fa-color');
            p.sortArrow('maxSpellSlots').should.equal('');
        });
    });

    describe('Max Slot Width', function() {
        it('should return the width of the slot bar as a percent.', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new SpellSlotsViewModel();
            p.addSlot();
            p.addSlot();
            p.addSlot();
            p.addSlot();
            p.maxSlotWidth().should.equal(25);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Reset Slots', function() {
        it('should reset all slot counts to 0.', function() {
            var c = CharacterManager.activeCharacter;
            CharacterManager.activeCharacter = function() {
                return {
                    key: function() { return '1234'; }
                };
            };

            var p = new SpellSlotsViewModel();
            p.blankSlot().maxSpellSlots(5);
            p.addSlot();
            p.blankSlot().maxSpellSlots(5);
            p.addSlot();

            p.slots()[0].usedSpellSlots(1);
            p.slots()[1].usedSpellSlots(1);

            p.resetSlots();
            p.slots()[0].usedSpellSlots().should.equal(0);
            p.slots()[1].usedSpellSlots().should.equal(0);

            CharacterManager.activeCharacter = c;
        });
    });

    describe('Clear', function() {
        it('should clear all the values in spell slots.', function() {
            var p = new SpellSlotsViewModel();
            var slot = new Slot();
            var slots = [slot];
            p.slots(slots);
            p.slots().should.equal(slots);
            p.clear();
            p.slots().length.should.equal(0);
        });
    });
});
