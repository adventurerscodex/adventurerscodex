"use strict";

/**
 * Models the different types of items.
 */
function ItemTypes() {
	var self = this;
};

ItemTypes._types = [
	{ type: 'sword', classifications: ['combat', 'weapon', 'equippable'] },
	{ type: 'shield', classifications: ['combat', 'weapon', 'equippable'] },
	{ type: 'quarter staff', classifications: ['combat', 'weapon', 'equippable'] },
	
	{ type: 'plate armor', classifications: ['combat', 'armor', 'equippable'] }
];

/**
 * Get all of the item types.
 */
ItemTypes.allTypes = function() {
	return ItemTypes._types;
};
	
/**
 * Get all of the item types with a given classification.
 * (i.e. get all 'equippable' types)
 */
ItemTypes.allWithClassification = function(type) {
	return ItemTypes._types.filter(function(t) {
		return (t.classifications.indexOf(type) > -1);
	});
};
