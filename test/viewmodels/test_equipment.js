"use strict";

describe('EquipmentViewModel', function(){
	describe('Load', function() {
		it('should load items to the equipment', function() {
			var fb = Item.findAllBy;
			Item.findAllBy = function(key) { return [new Item(), new Item()]; };
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var p = new EquipmentViewModel();
			p.equipment().length.should.equal(0);
			p.load();
			p.equipment().length.should.equal(2);			

			CharacterManager.activeCharacter = c;
			Item.findAllBy = fb;
		});
	});

	describe('Unload', function() {
		it('should unload the data to the items db.', function() {
			//Shims
			var saved = [false, false];
			var items = [new Item(), new Item()].map(function(e, i, _) {
				e.save = function() { saved[i] = true; }
				return e;
			});
			var fb = Item.findAllBy;
			Item.findAllBy = function(key) { return items; };
			
			saved.forEach(function(e, i, _) {
				e.should.equal(false);
			});
			//Test
 			var equipVM = new EquipmentViewModel();
 			equipVM.equipment().length.should.equal(0);
 			equipVM.load();
  			equipVM.equipment().length.should.equal(2);
 			equipVM.unload();
  			equipVM.equipment().length.should.equal(2);
  			
 			saved.forEach(function(e, i, _) {
				e.should.equal(true);
			});

			Item.findAllBy = fb;
			CharacterManager.activeCharacter = c;
		});
	});
	
	describe('Add Item', function() {
		it('should add a new item to the equipment', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var p = new EquipmentViewModel();
			p.clear();
			p.equipment().length.should.equal(0);
			p.addItem(new Item());
			p.equipment().length.should.equal(1);
			
			CharacterManager.activeCharacter = c;
		});
	});

	describe('Edit Item', function() {
		it('should select a item for editing.', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var eq = new EquipmentViewModel();
			eq.equipment().length.should.equal(0);
			eq.addItemButton();
			eq.equipment().length.should.equal(1);
			var item = eq.equipment.pop();
			eq.editItem(item);
			eq.selecteditem().should.equal(item)

			CharacterManager.activeCharacter = c;
		});
	});

	describe('Remove Item', function() {
		it('should remove a item from the equipment', function() {
			var c = CharacterManager.activeCharacter;
			CharacterManager.activeCharacter = function() {
				return {
					key: function() { return '1234'; }
				};
			};

			var p = new EquipmentViewModel();
			p.clear();
			p.equipment().length.should.equal(0);
			p.addItem(new Item());
			p.equipment().length.should.equal(1);
			p.removeItem(p.equipment()[0]);
			p.equipment().length.should.equal(0);			

			CharacterManager.activeCharacter = c;
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
	describe('Sort By', function() {
		it('should sort the list of spells by given criteria', function() {
			var eq = new EquipmentViewModel();
			eq.sortBy('itemName');
			eq.sort().should.equal(eq.sorts['itemName desc']);
			eq.sortBy('itemName');
			eq.sort().should.equal(eq.sorts['itemName asc']);
			eq.sortBy('itemWeight');
			eq.sort().should.equal(eq.sorts['itemWeight asc']);
			eq.sortBy('itemWeight');
			eq.sort().should.equal(eq.sorts['itemWeight desc']);
		});
	});

	describe('Sort Arrow', function() {
		it('should sort the list of skills by given criteria', function() {
			var eq = new EquipmentViewModel();
			eq.sortBy('itemName');
			eq.sort().should.equal(eq.sorts['itemName desc']);
			eq.sortArrow('itemName').should.equal('glyphicon glyphicon-arrow-down');
			eq.sortArrow('itemWeight').should.equal('');
			eq.sortBy('itemName');
			eq.sort().should.equal(eq.sorts['itemName asc']);
			eq.sortArrow('itemName').should.equal('glyphicon glyphicon-arrow-up');
			eq.sortArrow('itemWeight').should.equal('');
			//Numeric sort
			eq.sortBy('itemWeight');
			eq.sort().should.equal(eq.sorts['itemWeight asc']);
			eq.sortArrow('itemName').should.equal('');
			eq.sortArrow('itemWeight').should.equal('glyphicon glyphicon-arrow-up');
			eq.sortBy('itemWeight');
			eq.sort().should.equal(eq.sorts['itemWeight desc']);
			eq.sortArrow('itemName').should.equal('');
			eq.sortArrow('itemWeight').should.equal('glyphicon glyphicon-arrow-down');
		});
	});
});
