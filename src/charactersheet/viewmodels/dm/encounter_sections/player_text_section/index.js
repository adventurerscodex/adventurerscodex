import {
    CharacterManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    ChatServiceManager,
    PersistenceService,
    SortService
} from 'charactersheet/services';
import {
    Message,
    PlayerText,
    PlayerTextSection
} from 'charactersheet/models';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import ko from 'knockout';
import sectionIcon from 'images/encounters/read.svg';
import template from './index.html';

export function PlayerTextSectionViewModel(params) {
    var self = this;

    self.sectionIcon = sectionIcon;
    self.encounter = params.encounter;
    self.encounterId = ko.pureComputed(function() {
        if (!self.encounter()) { return; }
        return self.encounter().encounterId();
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
    self.load = function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);
        Notifications.party.joined.add(self._connectionHasChanged);
        Notifications.party.left.add(self._connectionHasChanged);

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        self._dataHasChanged();

        self._connectionHasChanged();
    };

    self.save = function() {
        var key = CharacterManager.activeCharacter().key();
        var section = PersistenceService.findByPredicates(PlayerTextSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (!section) {
            section = new PlayerTextSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }

        section.name(self.name());
        section.visible(self.visible());
        section.save();

        self.playerTexts().forEach(function(playerText, idx, _) {
            playerText.save();
        });
    };

    self.delete = function() {
        var key = CharacterManager.activeCharacter().key();
        var section = PersistenceService.findByPredicates(PlayerTextSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (section) {
            section.delete();
        }

        self.playerTexts().forEach(function(playerText, idx, _) {
            playerText.delete();
        });
    };

    /* UI Methods */

    /**
     * Filters and sorts the weaponss for presentation in a table.
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

    self.addPlayerText = function() {
        var playerText = self.blankPlayerText();
        playerText.characterId(CharacterManager.activeCharacter().key());
        playerText.encounterId(self.encounterId());
        playerText.save();
        self.playerTexts.push(playerText);
        self.blankPlayerText(new PlayerText());
    };

    self.removePlayerText = function(playerText) {
        playerText.delete();
        self.playerTexts.remove(playerText);
    };

    self.editPlayerText = function(playerText) {
        self.editItemIndex = playerText.__id;
        self.currentEditItem(new PlayerText());
        self.currentEditItem().importValues(playerText.exportValues());
        self.openModal(true);
    };

    self.toggleModal = function() {
        self.openModal(!self.openModal());
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

    self.modalFinishedClosing = function() {
        self.selectPreviewTab();

        if (self.openModal()) {
            Utility.array.updateElement(self.playerTexts(), self.currentEditItem(), self.editItemIndex);
        }

        self.save();
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

    /* Private Methods */

    self._dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var playerTexts = PersistenceService.findByPredicates(PlayerText, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ]);
        if (playerTexts) {
            self.playerTexts(playerTexts);
        }

        var section = PersistenceService.findByPredicates(PlayerTextSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (!section) {
            section = new PlayerTextSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }
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
