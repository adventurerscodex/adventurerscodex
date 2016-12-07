'use strict';

function Health() {
    var self = this;
    self.ps = PersistenceService.register(Health, self);
    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save',
            'DANGER_THRESHOLD', 'WARNING_THRESHOLD', 'hitpoints', 'totalHitpoints',
            'tempHitpointsRemaining', 'regularHitpointsRemaining', 'hitpointsText',
            'isKnockedOut', 'isDangerous', 'isWarning', 'progressType', 'regularProgressWidth',
            'tempProgressWidth', 'progressLabel', 'mapping']
    };

    self.DANGER_THRESHOLD = 0.30;
    self.WARNING_THRESHOLD = 0.50;

    self.characterId = ko.observable(null);
    self.maxHitpoints = ko.observable(10);
    self.tempHitpoints = ko.observable(0);
    self.damage = ko.observable(0);

    self.hitpoints = ko.pureComputed(function() {
        var damage = self.damage() ? self.damage() : 0;
        return self.totalHitpoints() - damage;
    }, self);

    self.totalHitpoints = ko.pureComputed(function() {
        var maxHP = self.maxHitpoints() ? self.maxHitpoints() : 0;
        var tempHP = self.tempHitpoints() ? self.tempHitpoints() : 0;
        return parseInt(maxHP) + parseInt(tempHP);
    }, self);

    self.tempHitpointsRemaining = ko.pureComputed(function() {
        return (parseInt(self.tempHitpoints()) - parseInt(self.damage()));
    }, self);

    self.regularHitpointsRemaining = ko.pureComputed(function() {
        if (self.tempHitpointsRemaining() > 0) {
            return parseInt(self.maxHitpoints());
        }
        return (parseInt(self.maxHitpoints()) - ((self.damage() ? parseInt(self.damage()) : 0) - parseInt(self.tempHitpoints())));
    }, self);

    //Progress bar methods.

    self.hitpointsText = ko.pureComputed(function() {
        return 'HP: ' + self.hitpoints().toString();
    });

    self.isKnockedOut =  ko.pureComputed(function() {
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


    self.progressLabel = ko.pureComputed(function() {
        if (self.isKnockedOut()) {
            return 'K.O.';
        }
        return '';
    }, self);

    self.clear = function() {
        var values = new Health().exportValues();
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
}

Health.findBy = function(characterId) {
    return PersistenceService.findAll(Health).filter(function(e,i,_) {
        return e.characterId() === characterId;
    });
};
