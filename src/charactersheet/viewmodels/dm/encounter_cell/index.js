import ko from 'knockout';

export function EncounterCellViewModel(encounter) {
    var self = this;

    self.id = encounter.uuid;
    self.encounter = encounter;
    self.parent = encounter.parent;
    self.coreUuid = encounter.coreUuid;
    self.name = encounter.name;
    self.location = encounter.location;
    self.isOpen = encounter.isOpen || ko.observable(false);

    self._children = ko.observableArray(encounter.children());

    /* UI Methods */

    self.arrowIconClass = ko.pureComputed(function() {
        return self.isOpen() ? 'fa fa-caret-down' : 'fa fa-caret-right';
    });

    self.children = ko.pureComputed(function() {
        return self._children().map(function(child, idx, _) {
            return new EncounterCellViewModel(child);
        });
    });

    self.toggleIsOpen = function() {
        self.isOpen(!self.isOpen());
        self._save();
    };

    self.shouldShowDelete = ko.pureComputed(function() {
        return true;
    });

    /* Child Management Methods */

    self.addChild = function(cell) {
        self._children.push(cell);
    };

    self.removeChild = function(child) {
        self._children(self._children().filter(function(encounter, idx, _) {
            return child.id() !== encounter.uuid();
        }));
    };

    /* Private Methods */

    /**
     * Since the encounter cell binds the same observables as the encounter
     * itself rather than copying the values, we can just call save since those
     * values are already saved to the encounter itself.
     */
    self._save = () => {
        self.encounter.ps.save();
    };
}
