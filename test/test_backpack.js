"use strict";

describe('EquipmentViewModel', function(){
	describe('Add Item', function() {
		it('should add a new item to the equipment', function() {
			var p = new EquipmentViewModel();
			p.clear();
			p.equipment().length.should.equal(0);
			p.addItem();
			p.equipment().length.should.equal(1);
		});
	});

	describe('Remove Item', function() {
		it('should remove a item from the equipment', function() {
			var p = new EquipmentViewModel();
			p.clear();
			p.equipment().length.should.equal(0);
			p.addItem();
			p.equipment().length.should.equal(1);
			p.removeItem(p.equipment().pop());
			p.equipment().length.should.equal(0);			
		});
	});

	describe('Clear', function() {
		it('should clear all the values in the equipment', function() {
			var p = new EquipmentViewModel();
			var item = [new Item()];
			p.equipment(item);
			p.equipment().should.equal(item);
			p.clear();
			p.equipment().length.should.equal(0);
		});
	});

	describe('Export', function() {
		it('should return an object with the data given', function() {
			var p = new EquipmentViewModel();
			p.clear();
			p.equipment().length.should.equal(0);
			p.addItem(new Item());
			p.equipment().length.should.equal(1);
			var e = p.exportValues();
			e.equipment.length.should.equal(p.equipment().length);
		});
	});
	
	describe('Import', function() {
		it('should import an object with the data given', function() {
			var p = new EquipmentViewModel();
			p.clear();
			p.equipment().length.should.equal(0);
			var equipment = [{ itemName:'', itemDesc: '', itemQty: '', itemWeight: '', itemIsEquippable: false }];
			p.importValues({ equipment: equipment });
			p.equipment().length.should.equal(equipment.length);
		});
	});
});
