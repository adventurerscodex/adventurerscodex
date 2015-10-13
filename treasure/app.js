function Treasure() {
    "use strict"

    var self = this;

    self.platinum =  ko.observable(0);
    self.gold = ko.observable(0);
    self.electrum = ko.observable(0);
    self.silver = ko.observable(0);
    self.copper = ko.observable(0);
    self.misc = ko.observable('');
    
    self.worth_in_gold = ko.computed(function(){
        var adj_platinum = parseInt(self.platinum()) * 10;
        var adj_gold = parseInt(self.gold());
        var adj_electrum = parseInt(self.electrum()) / 2;
        var adj_silver = parseInt(self.silver()) / 10;
        var adj_copper = parseInt(self.copper()) / 100;

        var total = adj_platinum + adj_gold + adj_electrum + adj_silver + adj_copper;

        return Math.round(total);
    })

    self.clear = function() {
        self.platinum(0);
        self.gold(0);
        self.electrum(0);
        self.silver(0);
        self.copper(0);
        self.misc('');
    };

    self.importValues = function(values) {
        self.platinum(values.platinum);
        self.gold(values.gold);
        self.electrum(values.electrum);
        self.silver(values.silver);
        self.copper(values.copper);
        self.misc(values.misc);
    };

    self.exportValues = function() {
        return {
            platinum: self.platinum(),
            gold: self.gold(),
            electrum: self.electrum(),
            silver: self.silver(),
            copper: self.copper(),
            misc: self.misc(),
        }
    };
};
