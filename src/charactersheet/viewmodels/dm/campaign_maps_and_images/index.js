import 'bin/knockout-custom-loader';
import { CampaignMapOrImage,
    MapOrImage,
    Message
 } from 'charactersheet/models';
import {
    CharacterManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    ChatServiceManager,
    ImageServiceManager,
    PersistenceService,
    SortService
} from 'charactersheet/services';
import ko from 'knockout';
import template from './index.html';

export function CampaignMapsAndImagesViewModel() {
    var self = this;

    self.mapsOrImages = ko.observableArray();
    self.blankMapOrImage = ko.observable(new CampaignMapOrImage());
    self.openModal = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');
    self.convertedDisplayUrl = ko.observable();
    self.fullScreen = ko.observable(false);

    self.sorts = {
        'name asc': { field: 'name', direction: 'asc' },
        'name desc': { field: 'name', direction: 'desc' },
        'description asc': { field: 'description', direction: 'asc' },
        'description desc': { field: 'description', direction: 'desc' }
    };

    self.filter = ko.observable('');
    self.sort = ko.observable(self.sorts['name asc']);

    // Push to Player
    self.selectedMapOrImageToPush = ko.observable();
    self.openPushModal = ko.observable(false);
    self.pushType = ko.observable('image');

    self._isConnectedToParty = ko.observable(false);

    /* Public Methods */

    self.toggleExhibit = function(image) {
        var imageService = ImageServiceManager.sharedService();
        if (image.isExhibited()) {
            image.isExhibited(false);
            image.save();
            imageService.clearImage();
        } else {
            imageService.publishImage(image.toJSON());
            imageService.clearExhibitFlag();
            image.isExhibited(true);
            image.save();
            self._dataHasChanged();
        }
    };

    self.load = function() {
        Notifications.global.save.add(self.save);
        Notifications.party.joined.add(self._connectionHasChanged);
        Notifications.party.left.add(self._connectionHasChanged);
        Notifications.exhibit.toggle.add(self._dataHasChanged);

        var key = CharacterManager.activeCharacter().key();
        var map = PersistenceService.findBy(CampaignMapOrImage, 'characterId', key);
        if (map) {
            self.mapsOrImages(map);
        }

        self._connectionHasChanged();
    };

    self.save = function() {
        self.mapsOrImages().forEach(function(map, idx, _) {
            map.save();
        });
    };

    self.delete = function() {
        self.mapsOrImages().forEach(function(map, idx, _) {
            map.delete();
        });
    };

    /* UI Methods */

    /**
     * Filters and sorts the weaponss for presentation in a table.
     */
    self.filteredAndSortedMapsAndImages = ko.computed(function() {
        return SortService.sortAndFilter(self.mapsOrImages(), self.sort(), null);
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

    self.addMapOrImage = function() {
        var mapOrImage = self.blankMapOrImage();
        mapOrImage.characterId(CharacterManager.activeCharacter().key());
        mapOrImage.save();
        self.mapsOrImages.push(mapOrImage);
        self.blankMapOrImage(new CampaignMapOrImage());
    };

    self.removeMapOrImage = function(mapOrImage) {
        mapOrImage.delete();
        self.mapsOrImages.remove(mapOrImage);
    };

    self.editMapOrImage = function(mapOrImage) {
        self.editItemIndex = mapOrImage.__id;
        self.currentEditItem(new MapOrImage());
        self.currentEditItem().importValues(mapOrImage.exportValues());
        self.convertedDisplayUrl(Utility.string.createDirectDropboxLink(self.currentEditItem().imageUrl()));
        self.openModal(true);
    };

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    /* Modal Methods */

    self.addModalFinishedOpening = function() {
        self.firstElementInModalHasFocus(true);
    };

    self.modalFinishedOpening = function() {
        self.selectPreviewTab();
    };

    self.modalFinishedClosing = function() {
        if (self.openModal()) {
            Utility.array.updateElement(self.mapsOrImages(), self.currentEditItem(), self.editItemIndex);
        }

        self.save();
        self.openModal(false);
    };

    self.selectPreviewTab = function() {
        self.convertedDisplayUrl(Utility.string.createDirectDropboxLink(self.currentEditItem().imageUrl()));
        self.previewTabStatus('active');
        self.editTabStatus('');
    };

    self.selectEditTab = function() {
        self.editTabStatus('active');
        self.previewTabStatus('');
        self.editFirstModalElementHasFocus(true);
    };

    self.toggleFullScreen = function() {
        self.fullScreen(!self.fullScreen());
    };

    /* Push to Player Methods */

    self.shouldShowPushButton = ko.pureComputed(function() {
        return self._isConnectedToParty();
    });

    self.pushModalFinishedClosing = function() {
        self.selectedMapOrImageToPush(null);
        self.openPushModal(false);
    };

    self.pushModalToPlayerButtonWasPressed = function(mapOrImage) {
        self.selectedMapOrImageToPush(mapOrImage);
        self.openPushModal(true);
    };

    /* Private Methods */

    self._connectionHasChanged = function() {
        var chat = ChatServiceManager.sharedService();
        self._isConnectedToParty(chat.currentPartyNode != null);
    };

    self._dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var mapOrImage = PersistenceService.findBy(CampaignMapOrImage, 'characterId', key);
        if (mapOrImage) {
            self.mapsOrImages(mapOrImage);
        }
    };
}

ko.components.register('campaign-maps-and-images', {
    viewModel: CampaignMapsAndImagesViewModel,
    template: template
});
