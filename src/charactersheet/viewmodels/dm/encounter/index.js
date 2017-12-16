import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import {
    Encounter,
    EnvironmentSection,
    MapsAndImagesSection,
    MonsterSection,
    NPCSection,
    NotesSection,
    PlayerTextSection,
    PointOfInterestSection,
    TreasureSection
} from 'charactersheet/models/dm';
import { EncounterCellViewModel } from 'charactersheet/viewmodels/dm';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import ko from 'knockout';
import template from './index.html';


export function EncounterViewModel() {
    var self = this;

    self.modalEncounter = ko.observable();
    self.modalEncounterSections = ko.observableArray([]);
    self.selectedCell = ko.observable();
    self.selectedEncounter = ko.observable();
    self.openModal = ko.observable(false);

    self.encounterCells = ko.observableArray();

    /* Encounter Sections */

    self.sectionModels = [
        { model: EnvironmentSection },
        { model: MapsAndImagesSection },
        { model: PointOfInterestSection },
        { model: NPCSection },
        { model: MonsterSection },
        { model: PlayerTextSection },
        { model: TreasureSection },
        { model: NotesSection }
    ];

    /* Public Methods */
    self.load = function() {
        self.encounterCells(self._getEncounterCells());
        self.selectedCell(self.encounterCells()[0]);
        self._updateSelectedEncounter();

        Notifications.encounters.changed.add(self._dataHasChanged);
    };

    /* Modal Methods */

    self.openAddModal = function() {
        var key = CharacterManager.activeCharacter().key();
        self.modalEncounter(new Encounter());
        self.modalEncounter().characterId(key);
        self.modalEncounterSections(
            self._getSectionsForEncounter(self.modalEncounter().encounterId())
        );

        self.openModal(true);
    };

    self.openAddModalWithParent = function(parent) {
        var key = CharacterManager.activeCharacter().key();
        self.modalEncounter(new Encounter());
        self.modalEncounter().parent(parent.encounterId());
        self.modalEncounter().characterId(key);

        self.modalEncounterSections(
            self._getSectionsForEncounter(self.modalEncounter().encounterId())
        );

        self.openModal(true);
    };

    self.modalSave = function(encounter, sections) {
        encounter().save();

        sections().forEach(function(section, i, _) {
            section.save();
        });
        sections([]);
        self.addEncounterToList(encounter());
        Notifications.encounters.changed.dispatch();
    };

    /* Manage Encounter Methods */

    self.selectEncounter = function(cell) {
        // Note: The nested-list has already selected the encounter...
        // we just need to be notified when a selection has occurred.
        self._updateSelectedEncounter();
    };

    self.addEncounterToList = function(encounter) {
        // Add the cell to the UI.
        if (encounter.parent()) {
            var parent = self._findCell(self.encounterCells(), 'encounterId', encounter.parent());
            parent.isOpen(true);
            parent.addChild(encounter);
        } else {
            self.encounterCells.push(new EncounterCellViewModel(encounter));
        }

        // Select the new encounter.
        var cellToSelect = self._findCell(self.encounterCells(), 'encounterId', encounter.encounterId());
        if (cellToSelect) {
            self.selectedCell(cellToSelect);
            self._updateSelectedEncounter();
        }
    };

    /**
     * Removes a given encounter from the database. This method is given to the
     * EncounterList Component as the `ondelete` callback. The component will
     * take care of removing the element from the UI.
     */
    self.deleteEncounter = function(cell) {
        var key = CharacterManager.activeCharacter().key();
        var encounter = PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('encounterId', cell.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];

        var parentCell = self._findCell(self.encounterCells(), 'encounterId', encounter.parent());
        if (parentCell) {
            parentCell.removeChild(cell);
        }

        var parentEncounter = PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('encounterId', encounter.parent()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (parentEncounter) {
            parentEncounter.removeChild(encounter.encounterId());
            parentEncounter.save();
        }

        cell.delete();
        if (!parentCell) {
            self.encounterCells.remove(cell);
        }

        if (self.encounterCells() && !self.encounterCells()[0]) {
            self.selectedCell(null);
        } else {
            self.selectedCell(self.encounterCells()[0]);
        }
        self._updateSelectedEncounter();
    };

    /* Private Methods */

    self._getEncounterCells = function() {
        var key = CharacterManager.activeCharacter().key();
        var allEncounters = PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('characterId', key)
        ]);
        var topLevel = allEncounters.filter(function(enc, idx, _) {
            return !enc.parent();
        });
        return topLevel.map(function(enc, idx, _) {
            return new EncounterCellViewModel(enc);
        });
    };

    self._findCell = function(cells, property, id) {
        var cell = null;
        for (var i=0; i<cells.length; i++) {
            if (id === cells[i][property]()) {
                cell = cells[i];
            } else {
                cell = self._findCell(cells[i].children(), property, id);
            }

            if (cell !== null) {
                break;
            }
        }
        return cell;
    };

    self._getSectionsForEncounter = function(id) {
        return self.sectionModels.map(function(sectionModel, i, _) {
            var key = CharacterManager.activeCharacter().key();
            var section = PersistenceService.findByPredicates(sectionModel.model, [
                new KeyValuePredicate('encounterId', id),
                new KeyValuePredicate('characterId', key)
            ])[0];
            if (!section) {
                section = new sectionModel.model();
                section.encounterId(id);
                section.characterId(key);
            }
            return section;
        });
    };

    self._dataHasChanged = function() {
        self.encounterCells().forEach(function(cell, idx, _) {
            cell.reloadData();
        });
    };

    self._updateSelectedEncounter = function() {
        // Update the selected encounter.
        if (!self.selectedCell()) {
            self.selectedEncounter(null);
            return;
        }

        var id = self.selectedCell().encounterId();
        var key = CharacterManager.activeCharacter().key();
        var selectedEncounter = PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('encounterId', id),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (selectedEncounter) {
            self.selectedEncounter(selectedEncounter);
        }
    };
}

ko.components.register('encounter', {
    viewModel: EncounterViewModel,
    template: template
});
