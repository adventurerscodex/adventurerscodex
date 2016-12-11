'use strict';

function PlayerImageViewModel() {
    var self = this;

    self.openModal = ko.observable(false);

    self.imageSource = ko.observable('link');
    self.imageUrl = ko.observable('');
    self.email = ko.observable('');
    self.height = ko.observable(80);
    self.width = ko.observable(80);

    self.firstFieldHasFocus = ko.observable(false);

    self.init = function() {
        Notifications.global.save.add(self.save);
    };

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        var image = PersistenceService.findFirstBy(ImageModel, 'characterId', key);
        if (image && image.imageUrl()) {
            self.imageUrl(image.imageUrl());
        } else {
            var image = new ImageModel();
            image.characterId(key);
            image.save();
        }

        var info = PersistenceService.findFirstBy(PlayerInfo, 'characterId', key);
        if (info) {
            self.email(info.email());
        } else {
            var info = new PlayerInfo();
            info.characterId(key);
            info.save();
        }

        var playerImageSource = PersistenceService.findFirstBy(PlayerImage, 'characterId', key);
        if (playerImageSource) {
            self.imageSource(playerImageSource.imageSource());
        } else {
            var playerImageSource = new PlayerImage();
            playerImageSource.characterId(key);
            playerImageSource.save();
        }

        //Subscriptions
        self.email.subscribe(self.dataHasChanged);
        self.imageUrl.subscribe(self.dataHasChanged);
        self.imageSource.subscribe(self.dataHasChanged);
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

    //Public Methods

    self.clear = function() {
        self.imageUrl('');
        self.email('');
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
            playerImageSource.imageSource(self.imageSource());
            playerImageSource.save();
        }
    };

    self.imageBorderClass = ko.pureComputed(function() {
        return self.playerImageSrc().length ? 'no-border' : 'dashed-border';
    });

    //Player Image Handlers

    self.playerImageSrc = ko.pureComputed(function() {
        if (self.imageSource() == 'link') {
            return self.imageUrl();
        }

        var url = self._getEmailUrl();
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
    }
}
