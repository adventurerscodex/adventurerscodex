'use strict';

function DailyFeature() {
    var self = this;
    self.ps = PersistenceService.register(DailyFeature, self);
    self.mapping = {
        include: ['characterId', 'featureName', 'featureMaxUses', 'featureUsed',
            'featureResetsOn', 'featureDescription', 'color']
    };

    self.featureColors = Fixtures.general.colorList;

    self.characterId = ko.observable(null);
    self.featureName = ko.observable('');
    self.featureMaxUses = ko.observable(0);
    self.featureUsed = ko.observable(0);
    self.featureResetsOn = ko.observable('');
    self.featureDescription = ko.observable('');
    self.color = ko.observable('');

    self.needsResetsOnImg = ko.pureComputed(function(){
        return self.featureResetsOn() != '';
    });

    self.resetsOnImgSource = ko.pureComputed(function(){
        if(self.featureResetsOn() === 'long') {
            return '/images/camping-tent-blue.svg';
        } else if (self.featureResetsOn() === 'short') {
            return '/images/meditation-blue.svg';
        } else {
            throw 'Unexpected feature resets on string.';
        }
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

DailyFeature.findAllBy = function(characterId) {
    return PersistenceService.findAll(DailyFeature).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};

DailyFeature.REST_VALUES = {
    SHORT_REST: 'short',
    LONG_REST: 'long'
};
