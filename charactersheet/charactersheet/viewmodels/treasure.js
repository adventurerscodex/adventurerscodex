'use strict';

function TreasureViewModel() {
    var self = this;

    self.treasure = ko.observable(new Treasure());

    self.init = function() {};
    
    self.load = function() {
        var t = Treasure.findBy(CharacterManager.activeCharacter().key());
        if (t.length > 0) {
            self.treasure(t[0]);
        } else {
            self.treasure(new Treasure());
        }
        self.treasure().characterId(CharacterManager.activeCharacter().key());
    };
    
    self.unload = function() {
        self.treasure().save();
    };

    self.clear = function() {
        self.treasure().clear();
    };

    self.importValues = function(values) {
        self.treasure().importValues(values.treasure);
    };

    self.exportValues = function() {
        return {
            treasure: self.treasure().exportValues()
        };
    };
}
