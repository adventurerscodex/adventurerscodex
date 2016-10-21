'use strict';

/**
 * A directory-like container with meta-data information about a container.
 */
function Encounter() {
    var self = this;
    self.ps = PersistenceService.register(Encounter, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'name', 'locale', 'notes',
            'parent', 'children']
    };

    // General Encounter Properties.
    self.characterId = ko.observable();
    self.encounterId = ko.observable();
    self.name = ko.observable();
    self.locale = ko.observable();
    self.notes = ko.observable();

    // Related Encounter IDs
    self.parent = ko.observable();
    self.children = ko.observableArray([]);

    // Public Methods

    /**
     * Returns the list of encounter objects corresponding to the child ids.
     */
    self.getChildren = function() {
        return self.children().map(function(id, idx, _) {
            return PersistenceService.findFirstBy(Encounter, 'encounterId', id);
        });

    };

    self.save = function() {
        self.ps.save();
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
}
