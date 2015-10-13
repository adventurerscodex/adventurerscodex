"use strict";

describe('Spell Slots View Model', function() {
	describe('Add Slots', function() {
		it('should add a new slot to the list of slots', function() {
			var p = new SpellSlotsViewModel();
			p.slots().length.should.equal(0);
			p.addSlot();
			p.slots().length.should.equal(1);
		});
	});
	
	describe('Remove Slot', function() {
		it('should remove a slot from the list of slots', function() {
			var p = new SpellSlotsViewModel();
			p.slots().length.should.equal(0);
			p.addSlot();
			p.slots().length.should.equal(1);
			p.removeSlot(p.slots().pop());
			p.slots().length.should.equal(0);			
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

	describe('Export', function() {
		it('should yield an object with all the info supplied.', function() {
			var p = new SpellSlotsViewModel();
			p.clear();
			p.slots().length.should.equal(0);
			p.addSlot();
			p.slots().length.should.equal(1);
			var e = p.exportValues();
			e.slots.length.should.equal(p.slots().length);
		});
	});
	
	describe('Import', function() {
		it('should import an object with all the info supplied.', function() {
			var p = new SpellSlotsViewModel();
			p.slots().length.should.equal(0);
			var slots = [{ level:10, maxSpellSlots: 0, usedSpellSlots: 4 }];
			p.importValues({ slots: slots });
			p.slots().length.should.equal(slots.length);
		});
	});
});

describe('Slot Model', function() {
	describe('Spell Slots', function() {
		it('should yield the number of total slots remaining.', function() {
			var s = new Slot();
			s.maxSpellSlots(4);
			s.usedSpellSlots(1);
			s.spellSlots().should.equal(3);
		});
	});
	
	describe('Increment Counter', function() {
		it('should increment the number of used slots.', function() {
			var s = new Slot();
			s.maxSpellSlots(4);
			s.usedSpellSlots(1);
			
			s.spellSlots().should.equal(3);
			s.incrUsed();
			s.spellSlots().should.equal(2);			
			s.incrUsed();
			s.incrUsed();
			s.spellSlots().should.equal(0);			
			s.incrUsed();
			s.spellSlots().should.equal(0);			
		});
	});

	describe('Decrement Counter', function() {
		it('should increment the number of used slots.', function() {
			var s = new Slot();
			s.maxSpellSlots(4);
			s.usedSpellSlots(1);

			s.spellSlots().should.equal(3);
			s.decrUsed();
			s.spellSlots().should.equal(4);			
			s.decrUsed();
			s.decrUsed();
			s.spellSlots().should.equal(4);			
		});
	});
	
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
			s.level().should.equal(0);
			s.maxSpellSlots().should.equal(0);
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

