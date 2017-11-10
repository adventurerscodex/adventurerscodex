import {
    Campaign,
    Exhibit
} from 'charactersheet/models/dm';
import {
    ImageModel,
    PlayerImage,
    PlayerInfo,
    Status,
    StatusWeightPair
} from 'charactersheet/models/common';
import {
    KeyValuePredicate,
    PersistenceService,
    SharedServiceManager,
    XMPPService
} from 'charactersheet/services/common';
import { CharacterManager } from 'charactersheet/utilities';
import { Notifications } from 'charactersheet/utilities/notifications';

export var DMCardFields = [
    {
        name: 'publisherJid',
        refreshOn: Notifications.item.changed,
        valueAccessor: function() {
            var xmpp = XMPPService.sharedService();
            return xmpp.connection.jid;
        }
    }, {
        name: 'name',
        refreshOn: Notifications.campaign.changed,
        valueAccessor: function() {
            var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', CharacterManager.activeCharacter().key());
            return campaign ? campaign.name() : '';
        }
    }, {
        name: 'playerName',
        refreshOn: Notifications.campaign.changed,
        valueAccessor: function() {
            var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', CharacterManager.activeCharacter().key());
            return campaign ? campaign.playerName() : '';
        }
    }, {
        name: 'playerType',
        refreshOn: Notifications.characters.changed,
        valueAccessor: function() {
            var character = CharacterManager.activeCharacter();
            return character ? character.playerType().key : 'character';
        }
    }, {
        name: 'imageUrl',
        refreshOn: Notifications.playerImage.changed,
        valueAccessor: function() {
            var defaultImage = 'https://www.gravatar.com/avatar/{}?d=mm';
            var image = PersistenceService.findFirstBy(PlayerImage, 'characterId', CharacterManager.activeCharacter().key());
            if (!image) { return defaultImage; }
            if (image.imageSource() === 'link') {
                var imageModel = PersistenceService.findFirstBy(ImageModel, 'characterId', CharacterManager.activeCharacter().key());
                if (!imageModel) { return defaultImage; }
                return imageModel.imageUrl() !== '' ? imageModel.imageUrl() : defaultImage;
            } else if (image.imageSource() === 'email') {
                var info = PersistenceService.findFirstBy(PlayerInfo, 'characterId', CharacterManager.activeCharacter().key());
                return info ? info.gravatarUrl() : defaultImage;
            } else {
                return defaultImage;
            }
        }
    }, {
        name: 'exhibitImage',
        refreshOn: Notifications.exhibit.changed,
        valueAccessor: function() {
            var exhibit = PersistenceService.findFirstBy(Exhibit, 'characterId', CharacterManager.activeCharacter().key());
            return exhibit ? exhibit.toJSON() : null;
        }
    }
];
