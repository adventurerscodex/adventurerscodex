describe('Backpack', function(){
	describe('Add Item', function() {
		it('should add a new item to the backpack', function() {
			var p = new Backpack();
			p.clear();
			p.backpack().length.should.equal(0);
			p.addItem();
			p.backpack().length.should.equal(1);
		});
	});

	describe('Remove Item', function() {
		it('should remove a item from the backpack', function() {
			var p = new Backpack();
			p.clear();
			p.backpack().length.should.equal(0);
			p.addItem();
			p.backpack().length.should.equal(1);
			p.removeItem(p.backpack().pop());
			p.backpack().length.should.equal(0);			
		});
	});

	describe('Clear', function() {
		it('should clear all the values in the backpack', function() {
			var p = new Backpack();
			var item = [new Item('', '', '', '', function(){})];
			p.backpack(item);
			p.backpack().should.equal(item);
			p.clear();
			p.backpack().length.should.equal(0);
		});
	});

	describe('Export', function() {
		it('should return an object with the data given', function() {
			var p = new Backpack();
			p.clear();
			p.backpack().length.should.equal(0);
			p.addItem();
			p.backpack().length.should.equal(1);
			var e = p.exportValues();
			e.backpack.length.should.equal(p.backpack().length);
		});
	});
	
	describe('Import', function() {
		it('should import an object with the data given', function() {
			var p = new Backpack();
			p.clear();
			p.backpack().length.should.equal(0);
			var backpack = [{ itemName:'', itemDesc: '', itemQty: '', itemWeight: '' }];
			p.importValues({ backpack: backpack });
			p.backpack().length.should.equal(backpack.length);
		});
	});
});