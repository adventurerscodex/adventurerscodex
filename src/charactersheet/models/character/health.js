import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';


export function Health() {
    var self = this;
    self.ps = PersistenceService.register(Health, self);
    self.mapping = {
        include: ['characterId', 'maxHitpoints', 'tempHitpoints', 'damage']
    };

    self.DANGER_THRESHOLD = 0.30;
    self.WARNING_THRESHOLD = 0.50;

    self.characterId = ko.observable(null);
    self.maxHitpoints = ko.observable(10);
    self.tempHitpoints = ko.observable(0);
    self.damage = ko.observable(0);

    self.hitpoints = ko.pureComputed(function() {
        return parseInt(self.regularHitpointsRemaining());
    }, self);

    self.totalHitpoints = ko.pureComputed(function() {
        var maxHP = self.maxHitpoints() ? parseInt(self.maxHitpoints()) : 0;
        var tempHP = self.tempHitpoints() ? parseInt(self.tempHitpoints()) : 0;
        return maxHP + tempHP;
    }, self);

    self.tempHitpointsRemaining = ko.pureComputed(function() {
        var tempHP = self.tempHitpoints() ? parseInt(self.tempHitpoints()) : 0;
        return tempHP;
    }, self);

    self.regularHitpointsRemaining = ko.pureComputed(function() {
        var damage = self.damage() ? parseInt(self.damage()) : 0;
        var maxHP = self.maxHitpoints() ? parseInt(self.maxHitpoints()) : 0;
        return maxHP - damage;
    }, self);

    //Progress bar methods.

    self.hitpointsText = ko.pureComputed(function() {
        var text = 'HP: ' + self.hitpoints().toString();
        if (self.tempHitpoints() > 0) {
            return text + ', Temp HP: ' + self.tempHitpoints().toString();
        }
        return text;
    });

    self.isKnockedOut = ko.pureComputed(function() {
        return parseInt(self.hitpoints()) / parseInt(self.totalHitpoints()) <= 0 ? true : false;
    }, self);

    self.isDangerous = ko.pureComputed(function() {
        return parseInt(self.hitpoints()) / parseInt(self.totalHitpoints()) < self.DANGER_THRESHOLD ? true : false;
    }, self);

    self.isWarning = ko.pureComputed(function() {
        return parseInt(self.hitpoints()) / parseInt(self.totalHitpoints()) < self.WARNING_THRESHOLD ? true : false;
    }, self);

    self.progressType = ko.pureComputed(function() {
        var type = 'progress-bar-success';
        if (self.isWarning()) { type = 'progress-bar-warning'; }
        if (self.isDangerous()) { type = 'progress-bar-danger'; }
        return type;
    }, self);

    self.regularProgressWidth = ko.pureComputed(function() {
        if (self.isKnockedOut()) {
            return '100%';
        }
        return (parseInt(self.regularHitpointsRemaining()) / parseInt(self.totalHitpoints()) * 100) + '%';
    }, self);

    self.tempProgressWidth = ko.pureComputed(function() {
        if (self.tempHitpointsRemaining() < 0) {
            return '0%';
        }
        return (parseInt(self.tempHitpointsRemaining()) / parseInt(self.totalHitpoints()) * 100) + '%';
    }, self);

    self.clear = function() {
        var values = new Health().exportValues();
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
Health.__name = 'Health';


PersistenceService.addToRegistry(Health);
