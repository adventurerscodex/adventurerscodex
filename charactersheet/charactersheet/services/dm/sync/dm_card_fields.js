'use strict';


var DMCardFields = [
    {
        name: 'publisherJid',
        refreshOn: Notifications.item.changed,
        valueAccessor: function() {
            var xmpp = XMPPService.sharedService();
            return xmpp.connection.jid;
        }
    }, {
        name: 'name',
        refreshOn: Notifications.campaign.campaignName.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Campaign, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.characterName() : '';
        }
    }, {
        name: 'playerName',
        refreshOn: Notifications.campaign.playerName.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Campaign, 'characterId', CharacterManager.activeCharacter().key());
            return campaign ? campaign.name() : '';
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
                return imageModel ? imageModel.imageUrl() : defaultImage;
            } else if (image.imageSource() === 'email') {
                var info = PersistenceService.findFirstBy(PlayerInfo, 'characterId', CharacterManager.activeCharacter().key());
                return info ? info.gravatarUrl() : defaultImage;
            } else {
                return defaultImage;
            }
        }
    }
];
