import { Campaign } from 'charactersheet/models/dm/campaign';
import { CharacterManager } from 'charactersheet/utilities';
import { Exhibit } from 'charactersheet/models/dm/exhibit';
import { ImageModel } from 'charactersheet/models/common/image';
import { KeyValuePredicate } from 'charactersheet/services/common/persistence_service_components/persistence_service_predicates';
import { Notifications } from 'charactersheet/utilities/notifications';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { PlayerImage } from 'charactersheet/models/common/player_image';
import { PlayerInfo } from 'charactersheet/models/common/player_info';
import { SharedServiceManager } from 'charactersheet/services/common/shared_service_manager';
import { Status } from 'charactersheet/models/common/status';
import { StatusWeightPair } from 'charactersheet/models/common/status_weight_pair';
import { Utility } from 'charactersheet/utilities/convenience';
import { XMPPService } from 'charactersheet/services/common/account/xmpp_connection_service';

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
                var convertedImage = Utility.string.createDirectDropboxLink(imageModel.imageUrl());
                return convertedImage !== '' ? convertedImage : defaultImage;
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
