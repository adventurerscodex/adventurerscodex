import { Encounter, EncounterSection } from 'charactersheet/models/dm';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { Notifications } from 'charactersheet/utilities';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import template from './index.html';

/**
 * This component manages the editing and creation of encounters and their
 * associated sections. It supplies a number of events to allow the parent to
 * respond. It should be noted that the encounter and it's sections **are not**
 * saved during this process. They are left unpersisted.
 *
 * Params:
 * - openModal: An observable that triggers the modal opening and closing.
 * - encounter: The encounter object to edit in with data.
 * - onsave: (Optional) A callback, taking 1 argument (encounter) for
 * notifications of when a save event occurs.
 */
export function EncounterAddEditModalViewModel({ encounter, openModal, onsave }) {
    var self = this;

    self.encounter = encounter;
    self.openModal = openModal;

    self.onsave = onsave;

    self.nameHasFocus = ko.observable(false);

    self.name = ko.observable();
    self.location = ko.observable();
    self.sections = ko.observableArray();

    self.sectionTypes = [];

    self.load = async () => {
        const { objects } = await EncounterSection.ps.list();
        self.sectionTypes = objects;

        self.encounter.subscribe(self._dataHasChanged);
        self._dataHasChanged();
    };

    /* UI Methods */

    self.titleLabel = ko.pureComputed(function() {
        if (self.encounter()) {
            return 'Edit this Encounter\'s Details';
        } else {
            return 'Add a new Encounter';
        }
    });

    self.doneButtonClicked = function() {
        const encounter = ko.unwrap(self.encounter);
        encounter.name(self.name());
        encounter.location(self.location());
        encounter.sections(self.sections());

        if (ko.unwrap(self.onsave)) {
            self.onsave(encounter);
        }
    };

    self.modalFinishedOpening = function() {
        self.nameHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.openModal(false);
    };

    /* Private Methods */

    self._dataHasChanged = () => {
        const encounter = ko.unwrap(self.encounter);
        if (ko.unwrap(encounter.uuid)) {
            self.name(encounter.name());
            self.location(encounter.location());
            self.sections(encounter.sections());
        } else {
            self.sections(self.sectionTypes.map(section => (
                // We need to wrap these as observables to see their values change.
                ko.mapping.fromJS(section.toSectionValues())
            )));
        }
    };
}

ko.components.register('encounter-add-edit-modal', {
    viewModel: EncounterAddEditModalViewModel,
    template: template
});
