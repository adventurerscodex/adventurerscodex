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
            return '';
        }
    }
];
