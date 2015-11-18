"use strict";

function TreasureViewModel() {
    var self = this;

	self.treasure = ko.observable(new Treasure());

    self.clear = function() {
        self.treasure().clear();
    };

    self.importValues = function(values) {
        self.treasure().importValues(values.treasure);
    };

    self.exportValues = function() {
        return {
            treasure: self.treasure().exportValues()
        }
    };
};
