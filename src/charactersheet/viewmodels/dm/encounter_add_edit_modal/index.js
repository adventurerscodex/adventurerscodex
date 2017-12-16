import { Encounter } from 'charactersheet/models/dm';
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
 * - sections: (Optional) A list of encounter sections to edit.
 * - sectionModals: (Optional) A list of encounter section modals.
 * - onsave: (Optional) A callback, taking 2 arguments (encounter, sections) for
 * notifications of when a save event occurs.
 */
export function EncounterAddEditModalViewModel(params) {
    var self = this;

    self.encounter = params.encounter;
    self.openModal = params.openModal;
    self.sections = params.sections || ko.observableArray();

    self.onsave = params.onsave;

    self.nameHasFocus = ko.observable(false);

    self.encounterLocation = ko.observable();
    self.encounterName = ko.observable();

    self.load = function() {
        self.encounter.subscribe(self._dataHasChanged);
        self._dataHasChanged();
    };

    /* UI Methods */

    self.titleLabel = ko.pureComputed(function() {
        if (self.encounter) {
            return 'Edit this Encounter\'s Details';
        } else {
            return 'Add a new Encounter';
        }
    });

    self.doneButtonClicked = function() {
        self.encounter().name(self.encounterName());
        self.encounter().encounterLocation(self.encounterLocation());

        if (ko.unwrap(self.onsave)) {
            self.onsave(self.encounter, self.sections);
        }
    };

    self.modalFinishedOpening = function() {
        self.nameHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.openModal(false);
    };

    /* Private Methods */

    self._dataHasChanged = function() {
        if (ko.unwrap(self.encounter)) {
            self.encounterName(self.encounter().name());
            self.encounterLocation(self.encounter().encounterLocation());
        }
    };
}


ko.components.register('encounter-add-edit-modal', {
    viewModel: EncounterAddEditModalViewModel,
    template: template
});
