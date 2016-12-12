'use strict';

/*
 * Model for notes section.
 */

function NotesSection() {
    var self = this;
    self.ps = PersistenceService.register(NotesSection, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'notes', 'visible']
    };

    // General Encounter Properties.
    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.name = ko.observable('Notes');
    self.tagline = ko.observable('Was there something particularly interesting about this place?');

    self.notes = ko.observable('');
    self.visible = ko.observable(true);

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.ps.delete();
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
