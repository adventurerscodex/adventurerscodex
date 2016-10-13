'use strict';

function FeaturesTraitsViewModel() {
    var self = this;

    self.featTraits = ko.observable(new FeaturesTraits());

    self.init = function() {
        Notifications.global.save.add(function() {
            self.featTraits().save();
        });

    };

    self.load = function() {
        var ft = FeaturesTraits.findBy(CharacterManager.activeCharacter().key());
        if (ft.length > 0) {
            self.featTraits(ft[0]);
        } else {
            self.featTraits(new FeaturesTraits());
        }
        self.featTraits().characterId(CharacterManager.activeCharacter().key());
    };

    self.unload = function() {
        self.featTraits().save();
    };
}
