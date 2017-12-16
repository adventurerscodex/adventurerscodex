import {
    CharacterManager,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    ChatServiceManager,
    ImageServiceManager,
    PersistenceService,
    SortService,
    XMPPService
} from 'charactersheet/services/common';
import {
    MapOrImage,
    Message
} from 'charactersheet/models/common';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { MapsAndImagesSection } from 'charactersheet/models/dm';
import ko from 'knockout';
import sectionIcon from 'images/encounters/globe.svg';
import template from './index.html';

export function MapsAndImagesSectionViewModel(params) {
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

    self.mapsOrImages = ko.observableArray();
    self.blankMapOrImage = ko.observable(new MapOrImage());
    self.openModal = ko.observable(false);
    self.editItemIndex = null;
    self.currentEditItem = ko.observable();
    self.firstElementInModalHasFocus = ko.observable(false);
    self.editFirstModalElementHasFocus = ko.observable(false);
    self.previewTabStatus = ko.observable('active');
    self.editTabStatus = ko.observable('');

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
    self.convertedDisplayUrl = ko.observable();

    self._isConnectedToParty = ko.observable(false);

    /* Public Methods */

    self.load = function() {
        Notifications.global.save.add(self.save);
        Notifications.encounters.changed.add(self._dataHasChanged);
        Notifications.party.joined.add(self._connectionHasChanged);
        Notifications.party.left.add(self._connectionHasChanged);
        Notifications.exhibit.toggle.add(self._dataHasChanged);

        self.encounter.subscribe(function() {
            self._dataHasChanged();
        });
        self._dataHasChanged();

        self._connectionHasChanged();
    };

    self.save = function() {
        var key = CharacterManager.activeCharacter().key();
        var section =  PersistenceService.findByPredicates(MapsAndImagesSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (!section) {
            section = new MapsAndImagesSection();
            section.encounterId(self.encounterId());
            section.characterId(key);
        }

        section.name(self.name());
        section.visible(self.visible());
        section.save();

        self.mapsOrImages().forEach(function(map, idx, _) {
            map.save();
        });
    };

    self.delete = function() {
        var key = CharacterManager.activeCharacter().key();
        var section =  PersistenceService.findByPredicates(MapsAndImagesSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (section) {
            section.delete();
        }

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
        mapOrImage.encounterId(self.encounterId());
        mapOrImage.save();
        self.mapsOrImages.push(mapOrImage);
        self.blankMapOrImage(new MapOrImage());
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

    self.toggleMapOrImageExhibit = function(image) {
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

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    /* Modal Methods */

    self.modalFinishedOpening = function() {
        self.firstElementInModalHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.selectPreviewTab();

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

    self._dataHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var map =  PersistenceService.findByPredicates(MapOrImage, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ]);
        if (map) {
            self.mapsOrImages(map);
        }

        var section =  PersistenceService.findByPredicates(MapsAndImagesSection, [
            new KeyValuePredicate('encounterId', self.encounterId()),
            new KeyValuePredicate('characterId', key)
        ])[0];
        if (!section) {
            section = new MapsAndImagesSection();
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

ko.components.register('maps-and-images-section', {
    viewModel: MapsAndImagesSectionViewModel,
    template: template
});
