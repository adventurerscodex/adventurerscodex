'use strict';

/*
 * Model for notes section.
 */

function NotesSection() {
    var self = this;
    self.ps = PersistenceService.register(NotesSection, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'notes']
    };

    // General Encounter Properties.
    self.characterId = ko.observable();
    self.encounterId = ko.observable();

    self.notes = ko.observable('');

    self.save = function() {
        self.ps.save();
    };

    self.clear = function() {
        var values = new NotesSection().exportValues();
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
}
