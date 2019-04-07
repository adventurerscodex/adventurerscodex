import 'bin/knockout-bootstrap-modal';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { SortService } from 'charactersheet/services/common';
import { Trap } from 'charactersheet/models/dm';
import ko from 'knockout';
import sectionIcon from 'images/encounters/tripwire.svg';
import template from './index.html';

export function TrapSectionViewModel(params) {
    const self = this;

    self.sectionIcon = sectionIcon;
    self.encounter = params.encounter;
    self.encounterId = ko.pureComputed(() => {
        if (!self.encounter()) { return; }
        return self.encounter().uuid();
    });
    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();
    self.tagline = ko.observable();

    self.traps = ko.observableArray();
    self.viewEditModalIsOpen = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.editWellOpen = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);

    self.blankTrap = ko.observable(new Trap());
    self.addFormIsValid = ko.observable(false);
    self.addModalIsOpen = ko.observable(false);
    self.addWellOpen = ko.observable(false);
    self.firstElementInModalHasFocus = ko.observable(false);

    self.sorts = {
        'isActive asc': { field: 'isActive', direction: 'asc' },
        'isActive desc': { field: 'isActive', direction: 'desc' },
        'name asc': { field: 'name', direction: 'asc' },
        'name desc': { field: 'name', direction: 'desc' },
        'trigger asc': { field: 'trigger', direction: 'asc' },
        'trigger desc': { field: 'trigger', direction: 'desc' },
        'effect asc': { field: 'effect', direction: 'asc' },
        'effect desc': { field: 'effect', direction: 'desc' }
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    self._addForm = ko.observable();
    self._editForm = ko.observable();

    self.load = () => {
        Notifications.encounters.changed.add(self._dataHasChanged);

        self.encounter.subscribe(() => {
            self._dataHasChanged();
        });
        self._dataHasChanged();
    };

    /* List Methods */

    /**
     * Filters and sorts the POIs for presentation in a table.
     */
    self.filteredAndSortedTraps = ko.computed(() => {
        return SortService.sortAndFilter(self.traps(), self.sort(), null);
    });

    /**
     * Determines whether a column should have an up/down/no arrow for sorting.
     */
    self.sortArrow = (columnName) => {
        return SortService.sortArrow(columnName, self.sort());
    };

    /**
     * Given a column name, determine the current sort type & order.
     */
    self.sortBy = (columnName) => {
        self.sort(SortService.sortForName(self.sort(), columnName, self.sorts));
    };

    self.addTrap = async () => {
        const trap = self.blankTrap();

        trap.coreUuid(CoreManager.activeCore().uuid());
        trap.encounterUuid(self.encounterId());

        const { object } = await trap.ps.create();
        object.isActive.subscribe(self.save, object);
        self.traps.push(object);

        self.toggleAddModal();
        self.blankTrap(new Trap());
    };

    self.removeTrap = async (trap) => {
        await trap.ps.delete();
        self.traps.remove(trap);
    };

    self.editTrap = (trap) => {
        self.editItemIndex = trap.uuid;
        self.currentEditItem(new Trap());
        self.currentEditItem().importValues(trap.exportValues());
        self.viewEditModalIsOpen(true);
    };

    /* Add Modal Methods */

    self.toggleAddModal = () => {
        self.addModalIsOpen(!self.addModalIsOpen());
    };

    self.toggleAddModalMoreFields = () => {
        self.addWellOpen(!self.addWellOpen());
    };

    self.addModalFinishedClosing = () => {
        self.addModalIsOpen(false);

        // Let the validator reset the validation in the form.
        $(self._addForm()).validate().resetForm();
    };

    self.addModalFinishedOpening = () => {
        self.firstElementInModalHasFocus(true);
    };


    /* Edit Modal Methods */

    self.toggleModal = () => {
        self.viewEditModalIsOpen(!self.viewEditModalIsOpen());
    };

    self.viewEditModalIsClosing = () => {
        self.viewEditModalIsOpen(false);
        self.selectPreviewTab();

        // Let the validator reset the validation in the form.
        $(self._editForm()).validate().resetForm();
    };

    self.selectPreviewTab = () => {
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = () => {
        self.editTabStatus('active');
        self.previewTabStatus('');
        self.editFirstModalElementHasFocus(true);
    };

    /* Validation Methods */

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addTrap();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Trap.validationConstraints
    };

    self.updateValidation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.modalFinishedClosing();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...Trap.validationConstraints
    };

    self.modalFinishedClosing = async () => {
        self.selectPreviewTab();

        if (self.viewEditModalIsOpen()) {
            const { object: trap } = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.traps(), trap, self.editItemIndex);
        }

        self.viewEditModalIsOpen(false);
    };

    /* Private Methods */

    self._dataHasChanged = async () => {
        if (!self.encounterId()) {
            return;
        }

        var coreUuid = CoreManager.activeCore().uuid();
        const { objects: traps } = await Trap.ps.list({ coreUuid, encounterUuid: self.encounterId() });
        self.traps(traps);

        self.traps().forEach((trap) => {
            trap.isActive.subscribe(self.save, trap);
        });

        const {
            name,
            visible,
            tagline
        } = self.encounter().sections()[Fixtures.encounter.sections.traps.index];

        self.name(name());
        self.visible(visible());
        self.tagline(tagline());
    };

    self.save = async function() {
        if (this.ps) {
            await this.ps.save();
        }
    };
}

ko.components.register('traps-section', {
    viewModel: TrapSectionViewModel,
    template: template
});
