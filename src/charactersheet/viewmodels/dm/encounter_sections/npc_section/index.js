import {
    SortService,
    PartyService
} from 'charactersheet/services';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { NPC } from 'charactersheet/models/dm';
import ko from 'knockout';
import { get } from 'lodash';
import sectionIcon from 'images/encounters/swordman.svg';
import template from './index.html';


export function NPCSectionViewModel(params) {
    var self = this;

    self.sectionIcon = sectionIcon;
    self.encounter = params.encounter;
    self.encounterId = ko.pureComputed(function() {
        if (!ko.unwrap(self.encounter)) { return; }
        return self.encounter().uuid();
    });

    self.characterId = ko.observable();

    self.visible = ko.observable();
    self.name = ko.observable();
    self.tagline = ko.observable();

    self.npcs = ko.observableArray();
    self.blankNPC = ko.observable(new NPC());
    self.openModal = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.addFormIsValid = ko.observable(false);
    self.addModalOpen = ko.observable(false);
    self.fullScreen = ko.observable(false);
    self.convertedDisplayUrl = ko.observable();

    self._isConnectedToParty = ko.observable(!!PartyService.party);

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc' },
        'name desc': { field: 'name', direction: 'desc' },
        'race asc': { field: 'race', direction: 'asc' },
        'race desc': { field: 'race', direction: 'desc' },
        'description asc': { field: 'description', direction: 'asc' },
        'description desc': { field: 'description', direction: 'desc' }
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    self._addForm = ko.observable();
    self._editForm = ko.observable();

    //Static Data
    self.raceOptions = Fixtures.profile.raceOptions;

    /* Public Methods */

    self.load = async function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);
        Notifications.party.changed.add(self.partyDidChange);

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });

        await self._dataHasChanged();
    };

    self.save = function() {
        self.npcs().forEach(function(npc) {
            npc.save();
        });
    };

    self.delete = function() {
        self.npcs().forEach(function(npc, idx, _) {
            npc.delete();
        });
    };

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addNPC();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...NPC.validationConstraints
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
        ...NPC.validationConstraints
    };

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    self.closeAddModal = () => {
        self.addModalOpen(false);

        // Let the validator reset the validation in the form.
        $(self._addForm()).validate().resetForm();
    };

    /* UI Methods */

    /**
     * Filters and sorts the weaponss for presentation in a table.
     */
    self.filteredAndSortedNpcs = ko.computed(function() {
        return SortService.sortAndFilter(self.npcs(), self.sort(), null);
    });

    /**
     * Determines whether a column should have an up/down/no arrow for sorting.
     */
    self.sortArrow = function(columnName) {
        return SortService.sortArrow(columnName, self.sort());
    };

    /**
     * Given a column name, determine the current sort type & order.
     */
    self.sortBy = function(columnName) {
        self.sort(SortService.sortForName(self.sort(), columnName, self.sorts));
    };

    self.addNPC = async function() {
        var npc = self.blankNPC();
        npc.coreUuid(CoreManager.activeCore().uuid());
        npc.encounterUuid(self.encounterId());
        const npcResponse = await npc.ps.create();
        self.npcs.push(npcResponse.object);
        self.toggleAddModal();
        self.blankNPC(new NPC());
    };

    self.removeNPC = async function(npc) {
        await npc.ps.delete();
        self.npcs.remove(npc);
    };

    self.editNPC = function(npc) {
        self.editItemIndex = npc.uuid;
        self.currentEditItem(new NPC());
        self.convertedDisplayUrl(null);
        self.currentEditItem().importValues(npc.exportValues());
        self.convertedDisplayUrl(Utility.string.createDirectDropboxLink(self.currentEditItem().sourceUrl()));
        self.openModal(true);
    };

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    self.toggleFullScreen = function() {
        self.fullScreen(!self.fullScreen());
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {
        self.firstElementInModalHasFocus(true);
    };

    self.modalFinishedClosing = async function() {
        self.selectPreviewTab();

        if (self.openModal()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.npcs(), response.object, self.editItemIndex);
        }

        self.openModal(false);
    };

    self.selectPreviewTab = function() {
        self.convertedDisplayUrl(Utility.string.createDirectDropboxLink(self.currentEditItem().sourceUrl()));
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = function() {
        self.editTabStatus('active');
        self.previewTabStatus('');
        self.editFirstModalElementHasFocus(true);
    };

    self.closeModal = () => {
        self.openModal(false);
        self.selectPreviewTab();

        // Let the validator reset the validation in the form.
        $(self._editForm()).validate().resetForm();
    };

    /* Exhibit Methods */

    self.shouldShowExhibitButton = ko.pureComputed(function() {
        return self._isConnectedToParty();
    });

    self.toggleExhibit = async (npc) => {
        npc.isExhibited(!npc.isExhibited());
        await npc.ps.save();
        self.markAsExhibited(npc.isExhibited() ? npc.uuid() : null);
    };

    // Pre-populate methods
    self.populateRace = function(label, value) {
        self.blankNPC().race(value);
    };

    self.populateRaceEdit = function(label, value) {
        self.currentEditItem().race(value);
    };

    /* Private Methods */

    self._dataHasChanged = async function() {
        if (!self.encounterId()) {
            return;
        }

        var coreUuid = CoreManager.activeCore().uuid();
        const npcResponse = await NPC.ps.list({coreUuid, encounterUuid: self.encounterId()});
        self.npcs(npcResponse.objects);

        var section = self.encounter().sections()[Fixtures.encounter.sections.npcs.index];
        self.name(section.name());
        self.visible(section.visible());
        self.tagline(section.tagline());
    };

    self.partyDidChange = (party) => {
        self._isConnectedToParty(!!party);

        // Update everything that isn't on exhibit. This event can
        // be fired from multiple places.
        const exhibitUuid = get(party, 'exhibit.uuid', null);
        self.markAsExhibited(exhibitUuid);
    };

    self.markAsExhibited = (exhibitUuid) => {
        self.npcs(
            self.npcs().map(npc => {
                npc.isExhibited(npc.uuid() === exhibitUuid);
                return npc;
            })
        );
    }
}

ko.components.register('npc-section', {
    viewModel: NPCSectionViewModel,
    template: template
});
