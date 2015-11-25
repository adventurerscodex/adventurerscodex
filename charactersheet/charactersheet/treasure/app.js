"use strict";

function TreasureViewModel() {
    var self = this;

	self.treasure = new Treasure();

	self.init = function() {
	
	};
	
	self.load = function() {
		var t = Treasure.find();
		if (t) {
			self.treasure = t;
		}
	};
	
	self.unload = function() {
		self.treasure.save();
	};

    self.clear = function() {
        self.treasure().clear();
    };

    self.importValues = function(values) {
        self.treasure.importValues(values.treasure);
    };

    self.exportValues = function() {
        return {
            treasure: self.treasure.exportValues()
        }
    };
};
