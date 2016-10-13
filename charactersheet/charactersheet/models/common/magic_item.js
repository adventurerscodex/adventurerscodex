'use strict';

function MagicItem() {
    var self = this;
    self.ps = PersistenceService.register(MagicItem, self);

    self.characterId = ko.observable(null);
    self.magicItemName = ko.observable('');
    self.magicItemType = ko.observable('');
    self.magicItemRarity = ko.observable('');
    self.magicItemRequiresAttunement = ko.observable(false);
    self.magicItemAttuned = ko.observable(false);
    self.magicItemMaxCharges = ko.observable(0);
    self.magicItemCharges = ko.observable(0);
    self.magicItemWeight = ko.observable(0);
    self.magicItemDescription = ko.observable('');
    self.magicItemTypeOptions = ko.observableArray(Fixtures.magicItem.magicItemTypeOptions);
    self.magicItemRarityOptions = ko.observableArray(Fixtures.magicItem.magicItemRarityOptions);

    self.chargesDisplay = ko.pureComputed(function(){
        if(self.magicItemMaxCharges() == 0){
            return 'N/A';
        }
        else {
            return self.magicItemCharges();
        }
    });

    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save',
                 'delete', 'chargesDisplay', 'magicItemTypeOptions',
                 'magicItemRarityOptions', 'mapping']
    };

    self.clear = function() {
        var values = new MagicItem().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.exportValues = function() {
        return ko.mapping.toJS(self, self.mapping);
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };
}

MagicItem.findAllBy =function(characterId) {
    return PersistenceService.findAll(MagicItem).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
