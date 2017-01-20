'use strict';

function AppearanceViewModel() {
    var self = this;

    self.appearance = ko.observable(new CharacterAppearance());

    self.load = function() {
        Notifications.global.save.add(function() {
            self.appearance().save();
        });
                
        var key = CharacterManager.activeCharacter().key();
        var appear = PersistenceService.findBy(CharacterAppearance, 'characterId', key);
        if (appear.length > 0) {
            self.appearance(appear[0]);
        } else {
            self.appearance(new CharacterAppearance());
        }
        self.appearance().characterId(key);
    };

    self.unload = function() {
        self.appearance().save();
    };

    self.clear = function() {
        self.appearance().clear();
    };
}
