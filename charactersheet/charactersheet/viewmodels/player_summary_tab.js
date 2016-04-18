"use strict";

function PlayerSummaryTabViewModel() {
	var self = this;

	self.playerSummaryViewModel = ko.observable(new PlayerSummaryViewModel());

	self.init = function() {
        ViewModelUtilities.initSubViewModels(self);
	};

    self.load = function() {
        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
    };

    self.clear = function() {
        ViewModelUtilities.clearSubViewModels(self);
    };
};
