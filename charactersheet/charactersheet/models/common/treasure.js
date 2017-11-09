import ko from 'knockout';
import 'knockout-mapping';

import 'bin/knockout-mapping-autoignore';

import { PersistenceService } from 'charactersheet/services/common/persistence_service';
export function Treasure() {
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

    self.worthInGold = ko.computed(function(){
        var parsedPlatinum = parseInt(self.platinum()) || 0;
        var parsedGold = parseInt(self.gold()) || 0;
        var parsedElectrum = parseInt(self.electrum()) || 0;
        var parsedSilver = parseInt(self.silver()) || 0;
        var parsedCopper = parseInt(self.copper()) || 0;

        var adjPlatinum = parsedPlatinum * 10;
        var adjGold = parsedGold;
        var adjElectrum = parsedElectrum / 2;
        var adjSilver = parsedSilver / 10;
        var adjCopper = parsedCopper / 100;

        var total = adjPlatinum + adjGold + adjElectrum + adjSilver + adjCopper;

        return Math.round(total);
    });

    self.totalWeight = ko.pureComputed(function() {
        var weight = 0;

        weight += self.platinum() ? parseInt(self.platinum()) : 0;
        weight += self.gold() ? parseInt(self.gold()) : 0;
        weight += self.electrum() ? parseInt(self.electrum()) : 0;
        weight += self.silver() ? parseInt(self.silver()) : 0;
        weight += self.copper() ? parseInt(self.copper()) : 0;

        weight = Math.floor(weight / 50);

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

    self.delete = function() {
        self.ps.delete();
    };
}


PersistenceService.addToRegistry(Treasure);
