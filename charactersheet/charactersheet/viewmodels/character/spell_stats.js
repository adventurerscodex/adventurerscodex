'use strict';

function SpellStatsViewModel() {
    var self = this;

    self.spellStats = ko.observable(new SpellStats());
    self.modalStatus = ko.observable(false);
    self.firstModalElementHasFocus = ko.observable(false);

    self.init = function() {
        Notifications.global.save.add(function() {
            self.spellStats().save();
        });
    };

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

    self.setSpellCastingAbility = function(label, value) {
        self.spellStats().spellcastingAbility(label);
    };

    // Modal Methods

    self.openModal = function() {
        self.modalStatus(true);
         // Alert the modal even if the value didn't technically change.
        self.modalStatus.valueHasMutated();
    };

    self.modalFinishedAnimating = function() {
        self.firstModalElementHasFocus(true);
        self.firstModalElementHasFocus.valueHasMutated();
    };
}
