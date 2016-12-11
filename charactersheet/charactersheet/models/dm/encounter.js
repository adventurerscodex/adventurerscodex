'use strict';

/**
 * A directory-like container with meta-data information about a container.
 */
function Encounter() {
    var self = this;
    self.ps = PersistenceService.register(Encounter, self);
    self.mapping = {
        include: ['characterId', 'encounterId', 'name', 'encounterLocation', 'notes',
            'parent', 'children']
    };

    // General Encounter Properties.
    self.characterId = ko.observable();
    self.encounterId = ko.observable(uuid.v4());
    self.name = ko.observable();
    self.encounterLocation = ko.observable();
    self.notes = ko.observable();

    //Collapse Properties
    self.isOpen = ko.observable(true);

    // Related Encounter IDs
    self.parent = ko.observable();
    self.children = ko.observableArray([]);

    /* Public Methods */

    self.removeChild = function(childId) {
        self.children(self.children().filter(function(id, idx, _) {
            return id !== childId;
        }));
    };

    /**
     * Returns the list of encounter objects corresponding to the child ids.
     */
    self.getChildren = function() {
        return self.children().map(function(id, idx, _) {
            return PersistenceService.findFirstBy(Encounter, 'encounterId', id);
        });
    };

    self.getParent = function() {
        return PersistenceService.findFirstBy(Encounter, 'encounterId', self.parent());
    };

    /* View Model Methods */

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
}
