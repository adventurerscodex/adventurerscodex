'use strict';

function FeatsProfViewModel() {
    var self = this;

    self.featsProf = ko.observable(new FeatsProf());

    self.init = function() {
        Notifications.global.save.add(function() {
            self.featsProf().save();
        });
    };

    self.load = function() {
        var fp = FeatsProf.findBy(CharacterManager.activeCharacter().key());
        if (fp.length > 0) {
            self.featsProf(fp[0]);
        } else {
            self.featsProf(new FeatsProf());
        }
        self.featsProf().characterId(CharacterManager.activeCharacter().key());
    };

    self.unload = function() {
        self.featsProf().save();
    };
}
