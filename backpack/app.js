function Backpack() {
/* 	function Backpack() {
		this.maxWeight =  ko.observable('100' + 'lb', { persist: 'backpack.maxWeight'});
		this.totalWeight =  ko.observable(function sumWeight(){
			//TODO
		}	+ 'lb', { persist: 'backpack.totalWeight'});
	
	}; */
	this.self = this;	//black magic
	this.backpack = ko.observableArray([]);
	this.blankItem = ko.observable(new Item());
	
	this.addItem = function() {
		this.backpack.push(this.blankItem());
		this.blankItem(new Item());
	};
	this.removeItem = function(item) {
		this.backpack.remove(item);
	};
	
	this.importValues = function(values) {
	};
	
	this.exportValues = function() {
		return {
		}
	};
};

function Item() {
	this.itemName = ko.observable('');
	this.itemDesc = ko.observable('');
	this.itemQty = ko.observable('');
	this.itemWeight = ko.observable('');
};