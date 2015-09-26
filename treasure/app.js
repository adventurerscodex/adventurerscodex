function Treasure() {
    "use strict"

    var self = this;

    self.platinum =  ko.observable(0, { persist: 'treasure.platinum'});
    self.gold = ko.observable(0, { persist: 'treasure.gold' });
    self.electrum = ko.observable(0, { persist: 'treasure.electrum' });
    self.silver = ko.observable(0, { persist: 'treasure.silver' });
    self.copper = ko.observable(0, { persist: 'treasure.copper' });

    self.clear = function() {
        self.platinum(0);
        self.gold(0);
        self.electrum(0);
        self.silver(0);
        self.copper(0);
    };

    self.importValues = function(values) {
        self.platinum(values.characterName);
        self.gold(values.playerName);
        self.electrum(values.race);
        self.silver(values.religion);
        self.copper(values.typeClass);
    };

    self.exportValues = function() {
        return {
            platinum: self.platinum(),
            gold: self.gold(),
            electrum: self.electrum(),
            silver: self.silver(),
            copper: self.copper(),
        }
    };
};