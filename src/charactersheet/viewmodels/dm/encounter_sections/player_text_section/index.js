import {
    ChatServiceManager,
    PersistenceService,
    SortService
} from 'charactersheet/services';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { PlayerText } from 'charactersheet/models';
import ko from 'knockout';
import sectionIcon from 'images/encounters/read.svg';
import template from './index.html';

export function PlayerTextSectionViewModel(params) {
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

    self.playerTexts = ko.observableArray();
    self.blankPlayerText = ko.observable(new PlayerText());
    self.openModal = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.addFormIsValid = ko.observable(false);
    self.addModalOpen = ko.observable(false);

    // Push to Player
    self.selectedItemToPush = ko.observable();
    self.openPushModal = ko.observable(false);
    self.pushType = ko.observable('read-aloud');

    self._isConnectedToParty = ko.observable(false);

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc' },
        'name desc': { field: 'name', direction: 'desc' },
        'description asc': { field: 'description', direction: 'asc' },
        'description desc': { field: 'description', direction: 'desc' }
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['description asc']);

    /* Public Methods */
    self.load = async function() {
        Notifications.encounters.changed.add(self._dataHasChanged);
        Notifications.party.joined.add(self._connectionHasChanged);
        Notifications.party.left.add(self._connectionHasChanged);

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        await self._dataHasChanged();

        self._connectionHasChanged();
    };

    /* UI Methods */

    /**
     * Filters and sorts the weapons for presentation in a table.
     */
    self.filteredAndSortedPlayerText = ko.computed(function() {
        return SortService.sortAndFilter(self.playerTexts(), self.sort(), null);
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

    self.addPlayerText = async function() {
        var playerText = self.blankPlayerText();
        playerText.coreUuid(CoreManager.activeCore().uuid());
        playerText.encounterUuid(self.encounterId());
        const playerTextResponse = await playerText.ps.create();
        self.playerTexts.push(playerTextResponse.object);
        self.toggleAddModal();
        self.blankPlayerText(new PlayerText());
    };

    self.removePlayerText = async function(playerText) {
        await playerText.ps.delete();
        self.playerTexts.remove(playerText);
    };

    self.editPlayerText = function(playerText) {
        self.editItemIndex = playerText.uuid;
        self.currentEditItem(new PlayerText());
        self.currentEditItem().importValues(playerText.exportValues());
        self.openModal(true);
    };

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    self.validation = {
        submitHandler: (form, event) => {
            event.preventDefault();
            self.addPlayerText();
        },
        updateHandler: ($element) => {
            self.addFormIsValid($element.valid());
        },
        // Deep copy of properties in object
        ...PlayerText.validationConstraints
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
        ...PlayerText.validationConstraints
    };

    self.toggleAddModal = () => {
        self.addModalOpen(!self.addModalOpen());
    };

    /* Push to Player Methods */

    self.shouldShowPushButton = ko.pureComputed(function() {
        return self._isConnectedToParty();
    });

    self.pushModalFinishedClosing = function() {
        self.selectedItemToPush(null);
        self.openPushModal(false);
    };

    self.pushModalToPlayerButtonWasPressed = function(playerText) {
        self.selectedItemToPush(playerText);
        self.openPushModal(true);
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {
        self.firstElementInModalHasFocus(true);
    };

    self.modalFinishedClosing = async function() {
        self.selectPreviewTab();

        if (self.openModal()) {
            const response = await self.currentEditItem().ps.save();
            Utility.array.updateElement(self.playerTexts(), response.object, self.editItemIndex);
        }

        self.openModal(false);
    };

    self.selectPreviewTab = function() {
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
    };

    /* Private Methods */

    self._dataHasChanged = async function() {
        var coreUuid = CoreManager.activeCore().uuid();
        const readAloudResponse = await PlayerText.ps.list({coreUuid, encounterUuid: self.encounterId()});
        self.playerTexts(readAloudResponse.objects);

        var section = self.encounter().sections()[Fixtures.encounter.sections.readAloudText.index];
        self.name(section.name());
        self.visible(section.visible());
        self.tagline(section.tagline());
    };

    self._connectionHasChanged = function() {
        var chat = ChatServiceManager.sharedService();
        self._isConnectedToParty(chat.currentPartyNode != null);
    };
}

ko.components.register('player-text-section', {
    viewModel: PlayerTextSectionViewModel,
    template: template
});
