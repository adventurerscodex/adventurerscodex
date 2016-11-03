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
    self.encounterId = ko.observable(uuid.v4());
    self.name = ko.observable();
    self.locale = ko.observable();
    self.notes = ko.observable();

    //Collapse Properties
    self.isOpen = ko.observable(true);

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

    self.toggleIsOpen = function() {
        self.isOpen(!self.isOpen());
    };

    self.arrowIconClass = ko.pureComputed(function() {
        return self.isOpen() ? 'fa fa-caret-down' : 'fa fa-caret-right';
    });

    /**
     * If the current encounter contains a parent, then check if it's parent
     * knows. If the parent isn't aware that it has a child, it could get really
     * awkward at dinner-time.
     */
    self.alertParentOfNewChild = function() {
        if (!self.parent()) { return; }
        var parent = PersistenceService.findFirstBy(Encounter, 'encounterId', self.parent());
        if (parent.children().indexOf(self.encounterId()) === -1) {
            parent.children.push(self.encounterId());
            parent.save();
        }
    };

    /**
     * If the node has a parent, remove itself from it's parent's custody.
     */
    self.alertParentOfLostChild = function() {
        if (!self.parent()) { return; }
        var parent = PersistenceService.findFirstBy(Encounter, 'encounterId', self.parent());
        if (parent.children().indexOf(self.encounterId()) > -1) {
            parent.children.remove(self.encounterId());
            parent.save();
        }
    };

    self.save = function() {
        self.ps.save();
    };

    self.delete = function() {
        self.alertParentOfLostChild();
        self.getChildren().forEach(function(child, idx, _) {
            child.delete();
        });
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
