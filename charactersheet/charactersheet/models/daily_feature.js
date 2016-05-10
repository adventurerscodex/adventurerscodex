'use strict';

function DailyFeature() {
    var self = this;
    self.ps = PersistenceService.register(DailyFeature, self);
    self.mapping = {
        ignore: ['clear', 'ps', 'importValues', 'exportValues', 'save', 'delete',
         'featureColors', 'currentFeaturesAvailable', 'progressLabel', 'dailyFeaturesProgressWidth']
    };

    self.featureColors = Fixtures.general.colorList;

    self.characterId = ko.observable(null);
    self.featureName = ko.observable('');
    self.featureMaxUses = ko.observable(1);
    self.featureUsed = ko.observable(0);
    self.featureResetsOn = ko.observable('');
    self.featureDescription = ko.observable('');

    self.color = ko.pureComputed(function() {
        return self.featureColors[Math.floor((Math.random() * 10) + 1)];
    });

    self.currentFeaturesAvailable = ko.pureComputed(function() {
        return ( parseInt( self.featureMaxUses() ) - parseInt( self.featureUsed() ) );
    });

    self.progressLabel = ko.pureComputed(function() {
        return (parseInt(self.featureMaxUses()) - parseInt(self.featureUsed())) + '/' + parseInt(self.featureMaxUses());
    });

    self.dailyFeaturesProgressWidth = ko.pureComputed(function() {
        return (parseInt(self.featureMaxUses()) - parseInt(self.featureUsed())) / parseInt(self.featureMaxUses());
    });

    self.clear = function() {
        var values = new DailyFeature().exportValues();
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

DailyFeature.findAllBy = function(characterId) {
    return PersistenceService.findAll(DailyFeature).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
