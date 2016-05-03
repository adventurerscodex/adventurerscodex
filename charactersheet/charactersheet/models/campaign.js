'use strict';

function Campaign() {
    var self = this;
    self.ps = PersistenceService.register(Campaign, self);
    self.mapping = {
        ignore: ['ps', 'mapping', 'importValues', 'exportValues', 'clear',
            'save', 'campaignSummary']
    };

    self.characterId = ko.observable(null);
    self.campaignName =  ko.observable('');
    self.dmName = ko.observable('');

    //UI Methods

    self.campaignSummary = ko.pureComputed(function() {
        return self.campaignName() + ' by ' + self.dmName();
    });

    //Public Methods

    self.clear = function() {
        var values = new Campaign().exportValues();
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

Campaign.findBy = function(characterId) {
    return PersistenceService.findAll(Campaign).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
