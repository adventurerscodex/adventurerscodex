"use strict";

/**
 * A module that listens for changes in the Profile and Campaign models
 * and summarizes the data, then sends it over the wire.
 */
function PlayerSummaryViewModel() {
    var self = this;
    
    self.playerSummaries = ko.observableArray([]);
    
    self.init = function() {
        Notifications.playerSummary.changed.add(self.dataHasChanged);
    };
    
    self.load = function() {};
    
    self.unload = function() {};
    
    self.dataHasChanged = function() {
        var summs = playerSummaryService.playerSummaries;
        self.playerSummaries(summs);
    };
};
