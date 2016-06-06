'use strict';

function ProfileViewModel() {
    var self = this;

    self.profile = ko.observable(new Profile());
    self.placeholderText = '<i>Character Name</i>';

    self.init = function() {
    };

    self.load = function() {
        var profile = Profile.findBy(CharacterManager.activeCharacter().key());
        if (profile.length > 0) {
            self.profile(profile[0]);
        } else {
            self.profile(new Profile());
        }
        self.profile().characterId(CharacterManager.activeCharacter().key());

        //Subscriptions
        self.profile().level.subscribe(self.dataHasChanged);
        self.profile().playerName.subscribe(self.dataHasChanged);
        self.profile().characterName.subscribe(self.dataHasChanged);
    };

    self.unload = function() {
        self.profile().save();
        self.profile(new Profile());
    };

    self.dataHasChanged = function() {
        self.profile().save();
        Notifications.profile.changed.dispatch();
    };

    //Public Methods

    self.clear = function() {
        self.profile().clear();
    };
}
