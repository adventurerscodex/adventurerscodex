'use strict';

function PlayerSummaryViewModel() {
    var self = this;

    self.playerSummaries = ko.observableArray([]);

    self.init = function() {};

    self.load = function() {
        Notifications.playerSummary.changed.add(self.dataHasChanged);
    };

    self.unload = function() {
        Notifications.playerSummary.changed.remove(self.dataHasChanged);
    };

    self.dataHasChanged = function() {
        var summs = playerSummaryService.playerSummaries;
        self.playerSummaries(summs);
    };
};
