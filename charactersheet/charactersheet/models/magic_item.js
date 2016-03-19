"use strict";

function MagicItem() {
    var self = this;
    self.ps = PersistenceService.register(MagicItem, self);

    self.characterId = ko.observable(null);
    self.magicItemName = ko.observable('');
    self.magicItemType = ko.observableArray('');
    self.magicItemRarity = ko.observableArray('');
    self.magicItemRequiresAttunement = ko.observable(false);
    self.magicItemAttuned = ko.observable(false);
    self.magicItemMaxCharges = ko.observable(0);
    self.magicItemCharges = ko.observable(0);
    self.magicItemWeight = ko.observable(0);
    self.magicItemDescription = ko.observable('');
    self.magicItemTypeOptions = ko.observableArray(
        ['Armor', 'Sword', 'Rod', 'Ring', 'Staff',
         'Wand', 'Potion', 'Wondrous Item']);
    self.magicItemRarityOptions = ko.observableArray(
        ['Uncommon', 'Common', 'Rare', 'Rarity Varies',
         'Very Rare', 'Legendary']);

    self.clear = function() {
        self.magicItemName('');
        self.magicItemType('');
        self.magicItemRarity('');
        self.magicItemRequiresAttunement(false);
        self.magicItemAttuned(false);
        self.magicItemMaxCharges(0);
        self.magicItemCharges(0);
        self.magicItemWeight(0);
        self.magicItemDescription('');
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);
        self.magicItemName(values.magicItemName);
        self.magicItemType(values.magicItemType);
        self.magicItemRarity(values.magicItemRarity);
        self.magicItemRequiresAttunement(values.magicItemRequiresAttunement)
        self.magicItemAttuned(values.magicItemAttuned);
        self.magicItemMaxCharges(values.magicItemMaxCharges);
        self.magicItemCharges(values.magicItemCharges);
        self.magicItemWeight(values.magicItemWeight);
        self.magicItemDescription(values.magicItemDescription);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            magicItemName: self.magicItemName(),
            magicItemType: self.magicItemType(),
            magicItemRarity: self.magicItemRarity(),
            magicItemRequiresAttunement: self.magicItemRequiresAttunement(),
            magicItemAttuned: self.magicItemAttuned(),
            magicItemMaxCharges: self.magicItemMaxCharges(),
            magicItemCharges: self.magicItemCharges(),
            magicItemWeight: self.magicItemWeight(),
            magicItemDescription: self.magicItemDescription(),
        }
    };

    self.save = function() {
      self.ps.save();
    };

    self.delete = function() {
      self.ps.delete();
    };
};

MagicItem.findAllBy =function(characterId) {
  return PersistenceService.findAll(MagicItem).filter(function(e, i, _) {
    return e.characterId() === characterId;
  });
};