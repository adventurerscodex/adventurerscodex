import 'bin/knockout-custom-loader';
import {
    CoreManager,
    Fixtures,
    Notifications,
    Utility
} from 'charactersheet/utilities';
import {
    PlayerTypes,
    ProfileImage
} from 'charactersheet/models/common';
import { OtherStats } from 'charactersheet/models/character';
import { PartyService } from 'charactersheet/services';
import ko from 'knockout';
import md5 from 'blueimp-md5';
import template from './index.html';


export function PlayerImageViewModel() {
    var self = this;

    self.openModal = ko.observable(false);

    self.imageSource = ko.observable('picker');
    self.imageUrl = ko.observable('');
    self.email = ko.observable('');
    self.playerImage = ko.observable();
    self.dataIsChanging = ko.observable(false);

    self.defaultImages = ko.observableArray(Fixtures.defaultProfilePictures);
    self.GRAVATAR_BASE_URL = 'https://www.gravatar.com/avatar/{}?d=mm';

    self.selectedDefaultImages = ko.observableArray();
    self.height = ko.observable(80);
    self.width = ko.observable(80);

    self.hasInspiredGlow = ko.observable(false);
    self.isConnectedToParty = ko.observable(!!PartyService.party);

    self.firstFieldHasFocus = ko.observable(false);

    self.load = async () => {
        //Subscriptions
        Notifications.otherstats.changed.add(self.inspirationHasChanged);
        Notifications.coreManager.changed.add(self.dataHasChanged);
        Notifications.party.changed.add(self._handleConnectionStatusChanged);

        await self.dataHasChanged();
    };

    self.doneButtonClicked = async () => {
        await self.saveAndNotify();
    };

    self.saveAndNotify = async () => {
        await self.save();
        Notifications.playerimage.changed.dispatch();
    };

    self.dataHasChanged = async () => {
        var key = CoreManager.activeCore().uuid();

        const imageResponse = await ProfileImage.ps.read({uuid: key});
        const image = imageResponse.object;
        self.dataIsChanging(true);
        if (image) {
            self.imageSource(image.type() != null ? image.type() : 'picker');
            self.imageUrl(image.sourceUrl());
            self.email(image.email());
            self.playerImage(image);
        } else {
            self.imageSource('picker');
        }
        self.dataIsChanging(false);

        var core = CoreManager.activeCore();
        if (core.type.name() === PlayerTypes.character.key) {
            const otherStatsResponse = await OtherStats.ps.read({uuid: core.uuid()});
            const otherStats = otherStatsResponse.object;
            self.inspirationHasChanged(otherStats);
        } else {
            self.hasInspiredGlow(false);
        }
    };

    self.inspirationHasChanged =  (otherStats) => {
        self.hasInspiredGlow(otherStats && otherStats.inspiration());
    };

    self.inspiredGlowClass = ko.pureComputed(function() {
        return self.hasInspiredGlow() ? 'image-border-inspired' : '';
    });

    //Public Methods

    self.save = async () => {
        if (self.imageSource() == 'picker') {
            self.playerImage().sourceUrl(self.selectedDefaultImages()[0].image);
            self.playerImage().type('url');
            self.playerImage().email(null);
            self.email('');
            self.imageUrl('');
        } else if (self.imageSource() == 'email') {
            self.playerImage().sourceUrl(null);
            self.playerImage().type(self.imageSource());
            self.playerImage().email(self.email());
            self.imageUrl('');
            self.selectedDefaultImages([]);
        } else {
            self.playerImage().sourceUrl(self.imageUrl());
            self.playerImage().type(self.imageSource());
            self.playerImage().email(null);
            self.email('');
            self.selectedDefaultImages([]);
        }
        await self.playerImage().ps.save();
    };

    self.imageBorderClass = ko.pureComputed(function() {
        if (!self.dataIsChanging()) {
            var border = self.playerImageSrc().length ? 'no-border' : 'dashed-border';
            var inspired = self.inspiredGlowClass();
            return border + ' ' + inspired;
        } else {
            return 'dashed-border';
        }
    });

    // Status Indicator Methods

    self.statusIndicatorClass = ko.pureComputed(function() {
        return self.isConnectedToParty() ? 'success' : 'failure';
    });

    self._handleConnectionStatusChanged = function() {
        self.isConnectedToParty(!!PartyService.party);
    };

    //Player Image Handlers

    self.playerImageSrc = ko.pureComputed(function() {
        if (!self.dataIsChanging()) {
            if (self.imageSource() == 'url') {
                return Utility.string.createDirectDropboxLink(self.imageUrl());
            }

            if (self.imageSource() == 'picker') {
                return self.selectedDefaultImages()[0] ? self.selectedDefaultImages()[0].image : '';
            }

            if (self.imageSource() == 'email' && self.email()) {
                return self.getGravatarUrl();
            }
        }
        return '';
    });

    self.getGravatarUrl = function() {
        try {
            var hash = md5(self.email().trim());
            return self.GRAVATAR_BASE_URL.replace('{}', hash);
        } catch(err) {
            return '';
        }
    };

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
}

ko.components.register('player-image', {
    viewModel: PlayerImageViewModel,
    template: template
});
