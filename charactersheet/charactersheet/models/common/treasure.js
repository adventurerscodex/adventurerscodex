'use strict';

function Treasure() {
    var self = this;
    self.ps = PersistenceService.register(Treasure, self);
    self.mapping = {
        include: ['characterId', 'platinum', 'gold',
                  'electrum', 'silver', 'copper']
    };

    self.characterId = ko.observable(null);
    self.platinum =  ko.observable(0);
    self.gold = ko.observable(0);
    self.electrum = ko.observable(0);
    self.silver = ko.observable(0);
    self.copper = ko.observable(0);

    self.worth_in_gold = ko.computed(function(){
        var adj_platinum = parseInt(self.platinum()) * 10;
        var adj_gold = parseInt(self.gold());
        var adj_electrum = parseInt(self.electrum()) / 2;
        var adj_silver = parseInt(self.silver()) / 10;
        var adj_copper = parseInt(self.copper()) / 100;

        var total = adj_platinum + adj_gold + adj_electrum + adj_silver + adj_copper;

        return Math.round(total);
    });

    self.totalWeight = ko.pureComputed(function() {
        var weight = 0;
        weight += parseInt(self.platinum());
        weight += parseInt(self.gold());
        weight += parseInt(self.electrum());
        weight += parseInt(self.silver());
        weight += parseInt(self.copper());

        weight = Math.floor(weight / 50)

        return weight;
    });

    self.totalWeightLabel = ko.pureComputed(function() {
        return self.totalWeight() + ' (lbs)';
    });

    self.clear = function() {
        var values = new Treasure().exportValues();
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
}

Treasure.findBy = function(characterId) {
    return PersistenceService.findAll(Treasure).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
