'use strict';

function MagicItem() {
    var self = this;

    self.DESCRIPTION_MAX_LENGTH = 145;

    self.ps = PersistenceService.register(MagicItem, self);
    self.mapping = {
        include: ['characterId', 'magicItemName', 'magicItemType', 'magicItemRarity',
            'magicItemRequiresAttunement', 'magicItemAttuned', 'magicItemMaxCharges',
            'magicItemCharges', 'magicItemWeight', 'magicItemDescription']
    };

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

    self.magicItemDescriptionHTML = ko.pureComputed(function() {
        if (self.magicItemDescription()){
            return self.magicItemDescription().replace(/\n/g, '<br />');
        } else {
            return '<div class="h3"><small>Add a description via the edit tab.</small></div>';
        }
    });

    self.shortDescription = ko.pureComputed(function() {
        if (self.magicItemDescription()) {
            return self.magicItemDescription().substring(0, self.DESCRIPTION_MAX_LENGTH) + '...';
        }
    });

    self.magicItemNameLabel = ko.pureComputed(function() {
        if(self.magicItemAttuned() === true){
            return (self.magicItemName() + ' (Attuned)' );
        } else {
            return self.magicItemName();
        }
    });

    self.magicItemWeightLabel = ko.pureComputed(function() {
        return self.magicItemWeight() + ' lbs.';
    });

    self.clear = function() {
        var values = new MagicItem().exportValues();
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

MagicItem.findAllBy =function(characterId) {
    return PersistenceService.findAll(MagicItem).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
