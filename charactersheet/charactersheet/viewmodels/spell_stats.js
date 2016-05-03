'use strict';

function SpellStatsViewModel() {
    var self = this;

    self.spellStats = ko.observable(new SpellStats());

    self.init = function() {};

    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        var stats = SpellStats.findBy(key);
        if (stats.length > 0) {
            self.spellStats(stats[0]);
        } else {
            self.spellStats(new SpellStats());
        }
        self.spellStats().characterId(key);
    };

    self.unload = function() {
        self.spellStats().save();
    };

    self.clear = function() {
        self.spellStats().clear();
    };

}
