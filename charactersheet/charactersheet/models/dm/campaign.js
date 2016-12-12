'use strict';

/**
 * A Root Level DM Object containing overview information about a campaign.
 */
function Campaign() {
    var self = this;
    self.ps = PersistenceService.register(Campaign, self);
    self.mapping = {
        include: ['characterId', 'playerName', 'name', 'notes', 'createdDate', 'setting']
    };

    self.characterId = ko.observable();
    self.playerName = ko.observable();
    self.setting = ko.observable();
    self.name = ko.observable();
    self.notes = ko.observable('');
    self.createdDate = ko.observable();

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
    };

    self.clear = function() {
        var values = new Encounter().exportValues();
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

    self.summary = function() {
        if (self.name() && self.playerName()) {
            return self.name() + ': A story by ' + self.playerName();
        }
        return 'A long long time ago...';
    };
}
