'use strict';

/**
 * Models an item in the user's backpack or something they
 * have equipped.
 */
function Item() {
    var self = this;

    self.DESCRIPTION_MAX_LENGTH = 200;

    self.ps = PersistenceService.register(Item, self);
    self.mapping = {
        include: ['characterId', 'itemName', 'itemDesc', 'itemQty', 'itemWeight',
        'itemCost', 'itemCurrencyDenomination']
    };

    self.characterId = ko.observable(null);
    self.itemName = ko.observable('');
    self.itemDesc = ko.observable('');
    self.itemQty = ko.observable(1);
    self.itemWeight = ko.observable(0);
    self.itemCost = ko.observable(0);
    self.itemCurrencyDenomination = ko.observable('');

    self.totalWeight = ko.pureComputed(function() {
        if (self.itemQty() && self.itemWeight()) {
            return parseInt(self.itemQty()) * parseFloat(self.itemWeight());
        }
        return 0;
    });

    self.shortDescription = ko.pureComputed(function() {
        if (self.itemDesc()) {
            return self.itemDesc().substring(0, self.DESCRIPTION_MAX_LENGTH) + '...';
        }
    });

    self.itemDescriptionHTML = ko.pureComputed(function() {
        if (self.itemDesc()){
            return self.itemDesc().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    self.itemWeightLabel = ko.pureComputed(function() {
        return self.itemWeight() + ' lbs.';
    });

    self.clear = function() {
        var values = new Item().exportValues();
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.importValues = function(values) {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        ko.mapping.fromJS(values, mapping, self);
    };

    self.exportValues = function() {
        var mapping = ko.mapping.autoignore(self, self.mapping);
        return ko.mapping.toJS(self, mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}

Item.findAllBy = function(characterId) {
    return PersistenceService.findAll(Item).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
