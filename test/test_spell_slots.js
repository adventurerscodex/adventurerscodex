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
			p.sortArrow('level').should.equal('glyphicon glyphicon-arrow-down');
			p.sortArrow('maxSpellSlots').should.equal('');
			p.sortBy('level');
			p.sort().should.equal(p.sorts['level asc']);
			p.sortArrow('level').should.equal('glyphicon glyphicon-arrow-up');
			p.sortArrow('maxSpellSlots').should.equal('');
		});
	});
	
	describe('Max Slot Width', function() {
		it('should return the width of the slot bar as a percent.', function() {
			var p = new SpellSlotsViewModel();
			p.addSlot();
			p.addSlot();
			p.addSlot();
			p.addSlot();
			p.maxSlotWidth().should.equal(25);			
		});
	});
	
	describe('Reset Slots', function() {
		it('should reset all slot counts to 0.', function() {
			var p = new SpellSlotsViewModel();
			p.blankSlot().maxSpellSlots(5);
			p.addSlot();
			p.slots()[0].incrUsed();
			p.blankSlot().maxSpellSlots(5);
			p.addSlot();
			p.slots()[1].incrUsed();
			p.slots()[1].incrUsed();
			p.resetSlots();
			p.slots()[0].usedSpellSlots().should.equal(0);
			p.slots()[1].usedSpellSlots().should.equal(0);
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

