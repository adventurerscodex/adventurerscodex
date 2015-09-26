function Treasure() {
    "use strict"

    var self = this;

    self.platinum =  ko.observable('', { persist: 'treasure.platinum'});
    self.gold = ko.observable('', { persist: 'treasure.gold' });
    self.electrum = ko.observable('', { persist: 'treasure.electrum' });
    self.silver = ko.observable('', { persist: 'treasure.silver' });
    self.copper = ko.observable('', { persist: 'treasure.copper' });

    self.clear = function() {
        self.platinum('');
        self.gold('');
        self.electrum('');
        self.silver('');
        self.copper('');
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