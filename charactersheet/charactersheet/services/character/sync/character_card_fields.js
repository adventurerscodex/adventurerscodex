'use strict';


var CharacterCardFields = [
    {
        name: 'playerName',
        refreshOn: Notifications.profile.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.playerName() : '';
        }
    },{
        name: 'playerType',
        refreshOn: Notifications.characters.changed,
        valueAccessor: function() {
            var character = CharacterManager.activeCharacter();
            return character ? character.playerType().key : 'character';
        }
    },{
        name: 'name',
        refreshOn: Notifications.profile.changed,
        valueAccessor: function() {
            var profile = PersistenceService.findFirstBy(Profile, 'characterId', CharacterManager.activeCharacter().key());
            return profile ? profile.characterName() : '';
        }
    },{
        name: 'imageUrl',
        refreshOn: Notifications.profile.changed,
        valueAccessor: function() {
            var image = PersistenceService.findFirstBy(PlayerImage, 'characterId', CharacterManager.activeCharacter().key());
            if (image.imageSource() === 'link') {
                var imageModel = PersistenceService.findFirstBy(ImageModel, 'characterId', CharacterManager.activeCharacter().key());
                return imageModel ? imageModel.imageUrl() : '';
            } else if (image.imageSource() === 'email') {
                var info = PersistenceService.findFirstBy(PlayerInfo, 'characterId', CharacterManager.activeCharacter().key());
                return info ? info.gravatarUrl() : '';
            } else {
                return null;
            }
        }
    }
];
