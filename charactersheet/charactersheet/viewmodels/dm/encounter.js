'use strict';

function EncounterViewModel() {
    var self = this;

    self.modalEncounter = ko.observable();
    self.nameHasFocus = ko.observable(false);
    self.selectedCell = ko.observable();
    self.encounterCells = ko.observableArray();
    self.encounterDetailViewModel = ko.observable();
    self.visibilityViewModels = ko.observableArray([]);

    /* Encounter Sections */

    self.sections = [
        { property: 'environmentSectionViewModel', vm: EnvironmentSectionViewModel, model: EnvironmentSection },
        { property: 'pointOfInterestSectionViewModel', vm: PointOfInterestSectionViewModel, model: PointOfInterestSection },
        { property: 'npcSectionViewModel', vm: NPCSectionViewModel, model: NPCSection },
        { property: 'monsterSectionViewModel', vm: MonsterSectionViewModel, model: MonsterSection },
        { property: 'playerTextSectionViewModel', vm: PlayerTextSectionViewModel, model: PlayerTextSection },
        { property: 'treasureSectionViewModel', vm: TreasureSectionViewModel, model: TreasureSection },
        { property: 'notesSectionViewModel', vm: NotesSectionViewModel, model: NotesSection }
    ];

    /* Public Methods */

    self.init = function() {
    };

    self.load = function() {
        self.selectedCell.subscribe(self.setEncounterDetailViewModel);

        self.encounterCells(self._getEncounterCells());
        self.selectedCell(self.encounterCells()[0]);
        Notifications.encounters.changed.add(self._dataHasChanged);
    };

    self.unload = function() {
        if (self.encounterDetailViewModel()) {
            self.encounterDetailViewModel().unload();
        }
        self.encounterCells().forEach(function(cell, idx, _) {
            cell.save();
        });

        Notifications.encounters.changed.remove(self._dataHasChanged);
    };

    /* UI Methods */

    /**
     * Sets the current encounter detail view model, if the encounter
     * changes then it deinitializes the old value and spins up a new
     * EncounterDetailViewModel with the value of the current encounter.
     */
    self.setEncounterDetailViewModel = function() {
        if (self.encounterDetailViewModel()) {
            self._deinitializeDetailViewModel();
        }

        var cell = self.selectedCell();
        if (!cell) { return null; }

        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', cell.encounterId());
        self.encounterDetailViewModel(new EncounterDetailViewModel(encounter, self.sections));
        self._initializeDetailViewModel();
    };

    /* Modal Methods */

    self.openAddModal = function() {
        self.modalEncounter(new Encounter());
        self._initializeVisibilityViewModel();
    };

    self.openAddModalWithParent = function(parent) {
        self.modalEncounter(new Encounter());
        self.modalEncounter().parent(parent.encounterId());
        self._initializeVisibilityViewModel();
    };

    self.modalFinishedOpening = function() {
        self.nameHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.modalEncounter(null);
        self._deinitializeVisibilityViewModel();
    };

    /* Manage Encounter Methods */

    self.addEncounter = function() {
        var key = CharacterManager.activeCharacter().key();

        // Create the encounter.
        var encounter = self.modalEncounter();
        encounter.characterId(key);

        if (!encounter.name()) {
            encounter.name('Untitled Encounter');
        }
        encounter.save();
        self.visibilityViewModels().forEach(function(vm, idx, _) {
            vm.save();
        });

        // Add the cell to the UI.
        if (encounter.parent()) {
            var parent = self._findCell(self.encounterCells(), 'encounterId', encounter.parent());
            parent.addChild(encounter);
        } else {
            self.encounterCells.push(new EncounterCellViewModel(encounter));
        }

        // Select the new encounter.
        var cellToSelect = self._findCell(self.encounterCells(), 'encounterId', encounter.encounterId());
        if (cellToSelect) {
            self.selectedCell(cellToSelect);
            self.encounterDetailViewModel().save();
        }
    };

    /**
     * Removes a given encounter from the database. This method is given to the
     * EncounterList Component as the `ondelete` callback. The component will
     * take care of removing the element from the UI.
     */
    self.deleteEncounter = function(cell) {
        var encounter = PersistenceService.findFirstBy(Encounter, 'encounterId', cell.encounterId());

        var parentCell = self._findCell(self.encounterCells(), 'encounterId', encounter.parent());
        if (parentCell) {
            parentCell.removeChild(cell);
        }

        var parentEncounter = PersistenceService.findFirstBy(Encounter, 'encounterId', encounter.parent());
        if (parentEncounter) {
            parentEncounter.removeChild(encounter.encounterId());
            parentEncounter.save();
        }

        cell.delete();
        if (!parentCell) {
            self.encounterCells.remove(cell);
        }

        self.encounterDetailViewModel().delete();
        self.encounterDetailViewModel(null);
        self.selectedCell(self.encounterCells()[0]);
    };

    /* Private Methods */

    self._initializeVisibilityViewModel = function() {
        self.visibilityViewModels(self.sections.map(function(section, idx, _) {
            var visibilityViewModel = new EncounterSectionVisibilityViewModel(self.modalEncounter(), section.model);
            visibilityViewModel.init();
            visibilityViewModel.load();
            return visibilityViewModel;
        }));
    };

    self._deinitializeVisibilityViewModel = function() {
        self.visibilityViewModels().forEach(function(vm, idx, _) {
            vm.unload();
        });
        self.visibilityViewModels([]);
    };

    self._initializeDetailViewModel = function() {
        self.encounterDetailViewModel().init();
        self.encounterDetailViewModel().load();
    };

    self._deinitializeDetailViewModel = function(vm) {
        self.encounterDetailViewModel().unload();
    };

    self._getEncounterCells = function() {
        var key = CharacterManager.activeCharacter().key();
        var allEncounters = PersistenceService.findBy(Encounter, 'characterId', key);
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

    self._dataHasChanged = function() {
        self.encounterCells().forEach(function(cell, idx, _) {
            cell.reloadData();
        });
    };
}
