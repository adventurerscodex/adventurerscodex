function Backpack() {
/* 	function Backpack() {
		this.maxWeight =  ko.observable('100' + 'lb', { persist: 'backpack.maxWeight'});
		this.totalWeight =  ko.observable(function sumWeight(){
			//TODO
		}	+ 'lb', { persist: 'backpack.totalWeight'});
	
	}; */
	self = this;	//black magic
	this.backpack = ko.observableArray([]);
	this.blankItem = ko.observable(new Item());
	
	this.addItem = function() {
		this.backpack.push(this.blankItem());
		this.blankItem(new Item());
	};
	this.removeItem = function(item) {
		self.backpack.remove(item);
	};
	
	//this.importValues = function(values) {
	//};
	
	//this.exportValues = function() {
	//};
};

function Item() {
	this.itemName = ko.observable('Holy Hand Grenade');
	this.itemDesc = ko.observable('First thou pullest the Holy Pin. Then thou must count to three. Three shall be the number of the counting and the number of the counting shall be three. Four shalt thou not count, neither shalt thou count two, excepting that thou then proceedeth to three. Five is right out. Once the number three, being the number of the counting, be reached, then lobbest thou the Holy Hand Grenade in the direction of thine foe, who, being naughty in my sight, shall snuff it.');
	this.itemQty = ko.observable('x' + '5');
	this.itemWeight = ko.observable('0.5' + 'lbs');
};