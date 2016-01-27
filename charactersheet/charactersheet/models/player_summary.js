"use strict";

/**
 * A simple representation of a player to be sent over the wire.
 */
function PlayerSummary() {
    var self = this;
    
    self.playerName = ko.observable();
    self.characterName = ko.observable();
    self.level = ko.observable();
};

/**
 * Create a player summary from a profile model.
 */
PlayerSummary.fromProfile = function(profile) {
    var summary = new PlayerSummary();
    summary.playerName(profile.playerName());
    summary.characterName(profile.characterName());
    summary.level(profile.level());
    return summary;
};
