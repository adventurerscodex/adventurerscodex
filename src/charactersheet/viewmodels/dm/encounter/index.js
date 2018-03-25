import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';
import {
    Encounter,
    EncounterArmor,
    EncounterCoins,
    EncounterItem,
    EncounterMagicItem,
    EncounterWeapon,
    Environment,
    EnvironmentSection,
    MapsAndImagesSection,
    Monster,
    MonsterAbilityScore,
    MonsterSection,
    NPC,
    NPCSection,
    NotesSection,
    PlayerText,
    PlayerTextSection,
    PointOfInterest,
    PointOfInterestSection,
    TreasureSection
} from 'charactersheet/models/dm';
import { EncounterCellViewModel } from 'charactersheet/viewmodels/dm';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { MapOrImage } from 'charactersheet/models/common';
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
        { section: EnvironmentSection, models: [Environment] },
        { section: MapsAndImagesSection, models: [MapOrImage] },
        { section: PointOfInterestSection, models: [PointOfInterest] },
        { section: NPCSection , models: [NPC] },
        { section: MonsterSection, models: [Monster, MonsterAbilityScore] },
        { section: PlayerTextSection, models: [PlayerText] },
        { section: TreasureSection, models: [EncounterArmor, EncounterCoins, EncounterItem, EncounterMagicItem, EncounterWeapon] },
        { section: NotesSection, models: null }
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
        var key = CoreManager.activeCore().uuid();
        self.modalEncounter(new Encounter());
        self.modalEncounter().characterId(key);
        self.modalEncounterSections(
            self._getSectionsForEncounter(self.modalEncounter().encounterId())
        );

        self.openModal(true);
    };

    self.openAddModalWithParent = function(parent) {
        var key = CoreManager.activeCore().uuid();
        self.modalEncounter(new Encounter());
        self.modalEncounter().parent(parent.encounterId());
        self.modalEncounter().characterId(key);

        self.modalEncounterSections(
            self._getSectionsForEncounter(self.modalEncounter().encounterId())
        );

        self.openModal(true);
    };

    self.modalSave = function(encounter, sections) {
        if (!encounter().name()) {
            encounter().name('Untitled Encounter');
        }
        encounter().save();

        sections().forEach(function(section, i, _) {
            section.save();
        });
        sections([]);
        self.addEncounterToList(encounter());
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
        var key = CoreManager.activeCore().uuid();
        var encounter = PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('encounterId', cell.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];

        var parentCell = self._findCell(self.encounterCells(), 'encounterId', encounter.parent());
        if (parentCell) {
            parentCell.removeChild(cell);
        }

        // Remove the current encounter from it's parents if it has any.

        var parentEncounter = PersistenceService.findByPredicates(Encounter, [
            new KeyValuePredicate('encounterId', encounter.parent()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (parentEncounter) {
            parentEncounter.removeChild(encounter.encounterId());
            parentEncounter.save();
        }

        // Delete the cell.

        self._deleteEncounterRelatedModels(encounter);
        encounter.delete();

        // Update UI.

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

    self._deleteEncounterRelatedModels = (encounter) => {
        encounter.getChildren().forEach(function(child, idx, _) {
            self._deleteEncounterRelatedModels(child);
            child.delete();
        });

        var key = CoreManager.activeCore().uuid();
        self.sectionModels.map(({ section }) => {
            PersistenceService.findByPredicates(section, [
                new KeyValuePredicate('encounterId', encounter.encounterId()),
                new KeyValuePredicate('characterId', key)
            ]).forEach((section) => {
                section.delete();
            });
        });
        self.sectionModels.map(({ models }) => {
            if (!models) { return; }
            models.forEach((model) => {
                PersistenceService.findByPredicates(model, [
                    new KeyValuePredicate('encounterId', encounter.encounterId()),
                    new KeyValuePredicate('characterId', key)
                ]).forEach((model) => {
                    model.delete();
                });
            });
        });
    };

    self._getEncounterCells = function() {
        var key = CoreManager.activeCore().uuid();
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
            var key = CoreManager.activeCore().uuid();
            var section = PersistenceService.findByPredicates(sectionModel.section, [
                new KeyValuePredicate('encounterId', id),
                new KeyValuePredicate('characterId', key)
            ])[0];
            if (!section) {
                section = new sectionModel.section();
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
        var key = CoreManager.activeCore().uuid();
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
