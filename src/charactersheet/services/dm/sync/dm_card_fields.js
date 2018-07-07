import { Campaign } from 'charactersheet/models/dm/campaign';
import { CoreManager } from 'charactersheet/utilities';
import { Exhibit } from 'charactersheet/models/dm/exhibit';
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
            var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', CoreManager.activeCore().uuid());
            return campaign ? campaign.name() : '';
        }
    }, {
        name: 'playerName',
        refreshOn: Notifications.campaign.changed,
        valueAccessor: function() {
            var campaign = PersistenceService.findFirstBy(Campaign, 'characterId', CoreManager.activeCore().uuid());
            return campaign ? campaign.playerName() : '';
        }
    }, {
        name: 'playerType',
        refreshOn: Notifications.characters.changed,
        valueAccessor: function() {
            var character = CoreManager.activeCore();
            return character ? character.playerType().key : 'character';
        }
    }, {
        name: 'imageUrl',
        refreshOn: Notifications.playerImage.changed,
        valueAccessor: function() {
            var defaultImage = 'https://www.gravatar.com/avatar/{}?d=mm';
            // var image = PersistenceService.findFirstBy(PlayerImage, 'characterId', CoreManager.activeCore().uuid());
            // if (!image) { return defaultImage; }
            // if (image.imageSource() === 'link') {
            //     var imageModel = PersistenceService.findFirstBy(ImageModel, 'characterId', CoreManager.activeCore().uuid());
            //     if (!imageModel) { return defaultImage; }
            //     var convertedImage = Utility.string.createDirectDropboxLink(imageModel.imageUrl());
            //     return convertedImage !== '' ? convertedImage : defaultImage;
            // } else if (image.imageSource() === 'email') {
            //     var info = PersistenceService.findFirstBy(PlayerInfo, 'characterId', CoreManager.activeCore().uuid());
            //     return info ? info.gravatarUrl() : defaultImage;
            // } else {
                return defaultImage;
            // }
        }
    }, {
        name: 'exhibitImage',
        refreshOn: Notifications.exhibit.changed,
        valueAccessor: function() {
            var exhibit = PersistenceService.findFirstBy(Exhibit, 'characterId', CoreManager.activeCore().uuid());
            return exhibit ? exhibit.toJSON() : null;
        }
    }
];
