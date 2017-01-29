'use strict';

function FeatsProfViewModel() {
    var self = this;

    self.featsProf = ko.observable(new FeatsProf());

    self.load = function() {
        Notifications.global.save.add(self.save);
        var fp = PersistenceService.findBy(FeatsProf, 'characterId',
            CharacterManager.activeCharacter().key());
        if (fp.length > 0) {
            self.featsProf(fp[0]);
        } else {
            self.featsProf(new FeatsProf());
        }
        self.featsProf().characterId(CharacterManager.activeCharacter().key());
    };

    self.unload = function() {
        self.featsProf().save();
        Notifications.global.save.remove(self.save);
    };

    self.save = function() {
        self.featsProf().save();
    };
}
