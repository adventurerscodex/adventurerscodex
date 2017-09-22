import ko from 'knockout'

import { Encounter } from 'charactersheet/models/dm'
import { EncounterSectionVisibilityViewModel } from 'charactersheet/viewmodels/dm'
import { ViewModelUtilities,
    Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'

import template from './index.html'

/**
 * A View Model for the detailed display of an encounter.
 * This is a child of the Encounter View Model and, when instantiated,
 * is given the encounter it will display. When the user selects another
 * encounter to focus on, the current encounter is cleaned up.
 */
export function EncounterDetailViewModel(params) {
    var self = this;

    self.encounter = params.encounter;
    self.visibilityVMs = ko.observableArray([]);

    self.sections = params.allSections;

//     self.environmentSectionViewModel = ko.observable();
//     self.mapsAndImagesSectionViewModel = ko.observable();
//     self.treasureSectionViewModel = ko.observable();
//     self.notesSectionViewModel = ko.observable();
//     self.playerTextSectionViewModel = ko.observable();
//     self.pointOfInterestSectionViewModel = ko.observable();
//     self.npcSectionViewModel = ko.observable();
//     self.monsterSectionViewModel = ko.observable();
//     // TODO: Add more sections...

    self.openModal = ko.observable(false);
    self.nameHasFocus = ko.observable(false);

    /* Public Methods */

    self.load = function() {
    };

    self.unload = function() {
    };

    self.save = function() {
        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', self.encounterId());
        if (encounter) {
            encounter.name(self.name());
            encounter.encounterLocation(self.encounterLocation());
            encounter.save();
            ViewModelUtilities.callOnSubViewModels(self, 'save');
        }
    };

    self.delete = function() {
        ViewModelUtilities.callOnSubViewModels(self, 'delete');
    };

    /* UI Methods */

    self.name = ko.pureComputed(function() {
        return self.encounter().name();
    });

    self.encounterLocation = ko.pureComputed(function() {
        return self.encounter().encounterLocation();
    });

    self.toggleModal = function() {
        self.openModal(!self.openModal());

        // Modal will open.
        if (self.openModal()) {
            self._initializeVisibilityVMs();
        }
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {
        self.nameHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.openModal(false);
        self.save();

        self.visibilityVMs().forEach(function(vm, idx, _) {
            vm.save();
        });
        self._deinitializeVisibilityVMs();
        Notifications.encounters.changed.dispatch();
    };

    // Modal Visibility VMs

    self._initializeVisibilityVMs = function() {
        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', self.encounterId());
        self.visibilityVMs(self.sections.map(function(section, idx, _) {
            var visibilityViewModel = new EncounterSectionVisibilityViewModel(encounter, section.model);
            visibilityViewModel.load();
            return visibilityViewModel;
        }));
    };

    self._deinitializeVisibilityVMs = function() {
        self.visibilityVMs([]);
    };
}

ko.components.register('encounter-detail', {
  viewModel: EncounterDetailViewModel,
  template: template
})
