"use strict";

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
