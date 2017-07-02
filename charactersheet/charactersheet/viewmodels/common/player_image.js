'use strict';

function PlayerImageViewModel() {
    var self = this;

    self.openModal = ko.observable(false);

    self.imageSource = ko.observable('picker');
    self.imageUrl = ko.observable('');
    self.email = ko.observable('');

    self.defaultImages = ko.observableArray(Fixtures.defaultProfilePictures);
    self.selectedDefaultImages = ko.observableArray();
    self.height = ko.observable(80);
    self.width = ko.observable(80);

    self.firstFieldHasFocus = ko.observable(false);

    self.init = function() {
        Notifications.global.save.add(self.save);
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        var image = PersistenceService.findFirstBy(ImageModel, 'characterId', key);
        if (image) {
            self.imageUrl(image.imageUrl());
        } else {
            image = new ImageModel();
            image.characterId(key);
            image.save();
        }

        var info = PersistenceService.findFirstBy(PlayerInfo, 'characterId', key);
        if (info) {
            self.email(info.email());
        } else {
            info = new PlayerInfo();
            info.characterId(key);
            info.save();
        }

        var playerImageSource = PersistenceService.findFirstBy(PlayerImage, 'characterId', key);
        if (playerImageSource) {
            self.imageSource(playerImageSource.imageSource());
        } else {
            playerImageSource = new PlayerImage();
            playerImageSource.characterId(key);
            playerImageSource.save();
        }

        //Subscriptions
        self.email.subscribe(self.dataHasChanged);
        self.imageUrl.subscribe(self.dataHasChanged);
        self.imageSource.subscribe(self.dataHasChanged);
        self.selectedDefaultImages.subscribe(self.updateImageUrl);
        Notifications.playerInfo.changed.add(self.dataHasChanged);
    };

    self.unload = function() {
        self.save();
        Notifications.playerInfo.changed.remove(self.dataHasChanged);
    };

    self.dataHasChanged = function() {
        self.save();
        Notifications.playerImage.changed.dispatch();
    };

    self.updateImageUrl = function() {
        var url = self.selectedDefaultImages()[0] ? self.selectedDefaultImages()[0].image : '';
        self.imageUrl(url);
    };

    //Public Methods

    self.clear = function() {
        self.imageUrl('');
        self.email('');
        self.selectedDefaultImages([]);
    };

    self.save = function() {
        var key = CharacterManager.activeCharacter().key();
        var info = PersistenceService.findFirstBy(PlayerInfo, 'characterId', key);
        if (info) {
            info.email(self.email());
            info.save();
        }
        var image = PersistenceService.findFirstBy(ImageModel, 'characterId', key);
        if (image) {
            image.imageUrl(self.imageUrl());
            image.save();
        }

        var playerImageSource = PersistenceService.findFirstBy(PlayerImage, 'characterId', key);
        if (playerImageSource) {
            if (self.imageSource() == 'picker') {
                playerImageSource.imageSource('link');
            } else {
                playerImageSource.imageSource(self.imageSource());
            }
            playerImageSource.save();
        }
    };

    self.imageBorderClass = ko.pureComputed(function() {
        return self.playerImageSrc().length ? 'no-border' : 'dashed-border';
    });

    //Player Image Handlers

    self.playerImageSrc = ko.pureComputed(function() {
        if (self.imageSource() == 'link') {
            return Utility.string.createDirectDropboxLink(self.imageUrl());
        }

        var url = self.selectedDefaultImages()[0] ? self.selectedDefaultImages()[0].image : '';
        if (self.imageSource() == 'picker') {
            return url;
        }

        url = self._getEmailUrl();
        if (self.imageSource() == 'email' && self.email()) {
            return url;
        }

        return '';
    });

    /* Modal Methods */

    self.toggleModal = function() {
        self.openModal(!self.openModal());
    };

    self.modalFinishedOpening = function() {
        self.firstFieldHasFocus(true);
    };

    self.modalFinishedClosing = function() {
        self.openModal(false);
        self.firstFieldHasFocus(false);
    };

    /* Private Methods */

    self._getEmailUrl = function() {
        var key = CharacterManager.activeCharacter().key();
        var info = PersistenceService.findFirstBy(PlayerInfo, 'characterId', key);
        if (info) {
            return info.gravatarUrl();
        }
    };
}
