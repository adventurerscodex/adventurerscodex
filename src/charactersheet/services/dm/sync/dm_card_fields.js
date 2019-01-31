import { Campaign } from 'charactersheet/models/dm/campaign';
import { CoreManager } from 'charactersheet/utilities';
import { Exhibit } from 'charactersheet/models/dm/exhibit';
import { Notifications } from 'charactersheet/utilities/notifications';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { ProfileImage } from 'charactersheet/models/common/player_image';
import { Utility } from 'charactersheet/utilities';
import { XMPPService } from 'charactersheet/services/common/account/xmpp_connection_service';

export var DMCardFields = [
    {
        name: 'publisherJid',
        refreshOn: Notifications.item.changed,
        valueAccessor: async () => {
            var xmpp = XMPPService.sharedService();
            return xmpp.connection.jid;
        }
    }, {
        name: 'name',
        refreshOn: Notifications.campaign.changed,
        valueAccessor: async () => {
            const { uuid } = CoreManager.activeCore();
            const { object: campaign } = await Campaign.ps.read({ uuid: uuid() });
            return campaign.name();
        }
    }, {
        name: 'playerName',
        refreshOn: Notifications.campaign.changed,
        valueAccessor: async () => {
            const { playerName } = CoreManager.activeCore();
            return playerName();
        }
    }, {
        name: 'playerType',
        refreshOn: Notifications.characters.changed,
        valueAccessor: async () => {
            const core = CoreManager.activeCore();
            return core.type.name();
        }
    }, {
        name: 'imageUrl',
        refreshOn: Notifications.playerImage.changed,
        valueAccessor: async () => {
            const defaultImage = 'https://www.gravatar.com/avatar/{}?d=mm';
            const imageResponse = await ProfileImage.ps.read({uuid: CoreManager.activeCore().uuid()});
            const image = imageResponse.object;

            if (!image) {
                return defaultImage;
            } else if (image.type() === 'url') {
                var convertedImage = Utility.string.createDirectDropboxLink(image.sourceUrl());
                return convertedImage !== '' ? convertedImage : defaultImage;
            } else if (image.type() === 'email') {
                return image.gravatarUrl() ? image.gravatarUrl() : defaultImage;
            } else {
                return defaultImage;
            }
        }
    }, {
        name: 'exhibitImage',
        refreshOn: Notifications.exhibit.changed,
        valueAccessor: async () => {
            const exhibit = PersistenceService.findFirstBy(
                Exhibit,
                'characterId',
                CoreManager.activeCore().uuid()
            );
            return exhibit ? exhibit.toJSON() : null;
        }
    }
];
