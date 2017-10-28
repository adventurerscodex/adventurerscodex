import ko from 'knockout'

import 'bin/knockout-custom-loader'

import { CharacterManager, Fixtures, Notifications, Utility } from 'charactersheet/utilities'
import { PersistenceService, XMPPService } from 'charactersheet/services/common'
import {
    ImageModel,
    PlayerImage,
    PlayerInfo
} from 'charactersheet/models/common'
import { OtherStats } from 'charactersheet/models/character'

import elfHead from 'images/sample-headshots/elf-head.png'
import elfHead2 from 'images/sample-headshots/elf-head-2.png'
import emoHead from 'images/sample-headshots/emo-head.png'
import sorceress from 'images/sample-headshots/sorceress-head.png'
import warriorHead from 'images/sample-headshots/warrior-head.png'
import warlockHead from 'images/sample-headshots/warlock-head.png'
import orcHead from 'images/sample-headshots/orc-head.png'
import druidHead from 'images/sample-headshots/druid-head.png'
import druidHead2 from 'images/sample-headshots/druid-head-2.png'
import dudeHead from 'images/sample-headshots/dude-head.png'
import dwarfHead from 'images/sample-headshots/dwarf-head.png'
import knightHead from 'images/sample-headshots/knight-head.png'
import mechanicHead from 'images/sample-headshots/mechanic-head.png'
import merchantHead from 'images/sample-headshots/merchant-head.png'
import randgerHead from 'images/sample-headshots/ranger-head.png'
import trollHead from 'images/sample-headshots/troll-head.png'

import template from './index.html'

export function PlayerImageViewModel() {
    var self = this;

    self.openModal = ko.observable(false);

    self.imageSource = ko.observable('picker');
    self.imageUrl = ko.observable('');
    self.email = ko.observable('');

    self.elfHead = elfHead;
    self.elfHead2 = elfHead2;
    self.emoHead = emoHead;
    self.sorceress = sorceress;
    self.warriorHead = warriorHead;
    self.warlockHead = warlockHead;
    self.orcHead = orcHead;
    self.druidHead = druidHead;
    self.druidHead2 = druidHead2;
    self.dudeHead = dudeHead;
    self.dwarfHead = dwarfHead;
    self.knightHead = knightHead;
    self.mechanicHead = mechanicHead;
    self.merchantHead = merchantHead;
    self.randgerHead = randgerHead;
    self.trollHead = trollHead;

    self.defaultImages = ko.observableArray([
        {'image': elfHead},
        {'image': elfHead2},
        {'image': emoHead},
        {'image': sorceress},
        {'image': warriorHead},
        {'image': warlockHead},
        {'image': orcHead},
        {'image': druidHead},
        {'image': druidHead2},
        {'image': dudeHead},
        {'image': dwarfHead},
        {'image': knightHead},
        {'image': mechanicHead},
        {'image': merchantHead},
        {'image': randgerHead},
        {'image': trollHead}
    ]);

    self.selectedDefaultImages = ko.observableArray();
    self.height = ko.observable(80);
    self.width = ko.observable(80);

    self.hasInspiredGlow = ko.observable(false);

    self.firstFieldHasFocus = ko.observable(false);

    self.init = function() {
        Notifications.global.save.add(self.save);
    };

    self.load = function() {
        // Prime the pump.
        self.updateImage();
        self.inspirationHasChanged();
        self._handleConnectionStatusChanged();

        //Subscriptions
        self.email.subscribe(self.dataHasChanged);
        self.imageUrl.subscribe(self.dataHasChanged);
        self.imageSource.subscribe(self.dataHasChanged);
        self.selectedDefaultImages.subscribe(self.updateImageUrl);
        Notifications.playerInfo.changed.add(self.dataHasChanged);
        Notifications.otherStats.inspiration.changed.add(self.inspirationHasChanged);
        Notifications.xmpp.connected.add(self._handleConnectionStatusChanged);
        Notifications.xmpp.disconnected.add(self._handleConnectionStatusChanged);
        Notifications.characterManager.changed.add(self.updateImage);
    };

    self.dataHasChanged = function() {
        self.save();
        Notifications.playerImage.changed.dispatch();
    };

    self.updateImage = function() {
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
    };

    self.updateImageUrl = function() {
        var url = self.selectedDefaultImages()[0] ? self.selectedDefaultImages()[0].image : '';
        self.imageUrl(url);
    };

    self.inspirationHasChanged = function() {
        var key = CharacterManager.activeCharacter().key();
        var otherStats = PersistenceService.findFirstBy(OtherStats, 'characterId', key);
        self.hasInspiredGlow(otherStats && parseInt(otherStats.inspiration()));
    };

    self.inspiredGlowClass = ko.pureComputed(function() {
        return self.hasInspiredGlow() ? 'image-border-inspired' : '';
    });

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
        var border = self.playerImageSrc().length ? 'no-border' : 'dashed-border';
        var inspired = self.inspiredGlowClass();
        return border + ' ' + inspired;
    });

    // Status Indicator Methods

    self._isConnectedToXMPP = ko.observable();

    self.statusIndicatorClass = ko.pureComputed(function() {
        if (self._isConnectedToXMPP()) {
            return 'success';
        }
        return 'failure';
    });

    self._handleConnectionStatusChanged = function() {
        var xmpp = XMPPService.sharedService();
        self._isConnectedToXMPP(xmpp.connection.connected);
    };

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

ko.components.register('player-image', {
  viewModel: PlayerImageViewModel,
  template: template
})
