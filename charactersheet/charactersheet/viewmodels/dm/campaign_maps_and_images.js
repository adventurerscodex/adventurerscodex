'use strict';

function CampaignMapsAndImagesViewModel() {
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
    self.pushModalViewModel = ko.observable();
    self.openPushModal = ko.observable(false);

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
        Notifications.exhibit.toggle.add(self._dataHasChanged);

        var key = CharacterManager.activeCharacter().key();
        var map = PersistenceService.findBy(CampaignMapOrImage, 'characterId', key);
        if (map) {
            self.mapsOrImages(map);
        }

        self._connectionHasChanged();
    };

    self.unload = function() {
        Notifications.global.save.remove(self.save);
        Notifications.party.joined.remove(self._connectionHasChanged);
        Notifications.exhibit.toggle.remove(self._dataHasChanged);
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
        self.openModal(true);
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

    self.pushModalToPlayerButtonWasPressed = function(mapOrImage) {
        self.selectedMapOrImageToPush(mapOrImage);
        self.pushModalViewModel(new PlayerPushModalViewModel(self));
        self.pushModalViewModel().load();
        self.openPushModal(true);
    };

    self.pushModalFinishedClosing = function() {
        self.pushModalViewModel().unload();
        self.pushModalViewModel(null);
        self.selectedMapOrImageToPush(null);
        self.openPushModal(false);
    };

    self.pushModalDoneButtonWasClicked = function() {
        var selected = self.pushModalViewModel().selectedPartyMembers();
        var mapOrImage = self.selectedMapOrImageToPush();

        self.pushMapOrImageToPlayers(mapOrImage, selected);
    };

    /**
     * Given an map or image to push, send it as an HTML message
     * to the given player/players.
     */
    self.pushMapOrImageToPlayers = function(mapOrImage, players) {
        var chat = ChatServiceManager.sharedService();
        var currentParty = chat.currentPartyNode;
        var xmpp = XMPPService.sharedService();

        players.forEach(function(player, idx, _) {
            var bare = Strophe.getBareJidFromJid(player.jid);
            var nick = chat.getNickForBareJidInParty(bare);

            var message = new Message();
            message.importValues({
                to: currentParty + '/' + nick,
                type: 'chat',
                from: xmpp.connection.jid,
                id: xmpp.connection.getUniqueId(),
                html: mapOrImage.toHTML(),
                body: ''
            });

            message.item({
                xmlns: Strophe.NS.JSON + '#image',
                json: mapOrImage.toJSON()
            });

            xmpp.connection.send(message.tree());
        });
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
