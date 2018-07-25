import { CoreManager, Notifications } from 'charactersheet/utilities';
import { Encounter } from 'charactersheet/models/dm';
import { EncounterCellViewModel } from 'charactersheet/viewmodels/dm';
import { MapOrImage } from 'charactersheet/models/common';
import ko from 'knockout';
import template from './index.html';

export function EncounterViewModel() {
    var self = this;

    self.modalEncounter = ko.observable();
    self.selectedCell = ko.observable();
    self.selectedEncounter = ko.observable();
    self.openModal = ko.observable(false);

    self.encounterCells = ko.observableArray();

    /* Public Methods */

    self.load = async () => {
        self.encounterCells(await self._getEncounterCells());
        self.selectedCell(self.encounterCells()[0]);
        self._updateSelectedEncounter();
        Notifications.encounters.changed.add(self._dataHasChanged);
    };

    /* Modal Methods */

    self.openAddModal = () => {
        var key = CoreManager.activeCore().uuid();
        self.modalEncounter(new Encounter());
        self.modalEncounter().coreUuid(key);
        self.openModal(true);
    };

    self.openAddModalWithParent = function(parent) {
        var key = CoreManager.activeCore().uuid();
        self.modalEncounter(new Encounter());
        self.modalEncounter().parent(parent.encounterId());
        self.modalEncounter().characterId(key);
        self.openModal(true);
    };

    self.modalSave = async function(modalEncounter) {
        if (!modalEncounter.name()) {
            modalEncounter.name('Untitled Encounter');
        }

        // Called this way, we always create. We can't edit encounters from here.
        const { object: encounter } = await modalEncounter.ps.create();
        self.addEncounterToList(encounter);
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
            var parent = self._findCell(self.encounterCells(), 'uuid', encounter.parent());
            parent.isOpen(true);
            parent.addChild(encounter);
        } else {
            self.encounterCells.push(new EncounterCellViewModel(encounter));
        }

        // Select the new encounter.
        var cellToSelect = self._findCell(self.encounterCells(), 'uuid', encounter.encounterId());
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
    self.deleteEncounter = async ({ encounter }) => {
        await encounter.ps.delete();

        self.encounterCells(await self._getEncounterCells());

//         var parentCell = self._findCell(self.encounterCells(), 'encounterId', encounter.parent());
//         if (parentCell) {
//             parentCell.removeChild(cell);
//         }
//
//         // Update UI.
//
//         if (!parentCell) {
//             self.encounterCells.remove(cell);
//         }
//
//         if (self.encounterCells() && !self.encounterCells()[0]) {
//             self.selectedCell(null);
//         } else {
//             self.selectedCell(self.encounterCells()[0]);
//         }
//         self._updateSelectedEncounter();
    };

    /* Private Methods */

    self._getEncounterCells = async () => {
        const coreUuid = CoreManager.activeCore().uuid();
        const { objects: encounters } = await Encounter.ps.list({ coreUuid });
        return encounters.map((enc, idx, _) => {
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

    self._updateSelectedEncounter = async () => {
        // Update the selected encounter.
        if (!self.selectedCell()) {
            self.selectedEncounter(null);
            return;
        }

        const { encounter } = self.selectedCell();
        if (encounter) {
            self.selectedEncounter(encounter);
        }
    };
}

ko.components.register('encounter', {
    viewModel: EncounterViewModel,
    template: template
});
