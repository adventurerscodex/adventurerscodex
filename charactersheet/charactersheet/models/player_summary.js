"use strict";

/**
 * A simple representation of a player to be sent over the wire.
 */
function PlayerSummary() {
    var self = this;
    
    self.playerName = ko.observable();
    self.characterName = ko.observable();
    self.level = ko.observable();
    self.playerType = ko.observable();
    
    self.importValues = function(values) {
        self.playerName(values.playerName);
        self.characterName(values.characterName);
        self.level(values.level);
        self.playerType(values.playerType);
    };
    
    self.exportValues = function() {
        return {
            playerName: self.playerName(),
            characterName: self.characterName(),
            level: self.level(),
            playerType: self.playerType(),
        };
    };
};

PlayerSummary.findBy = function(characterId) {
    var character = Character.findBy(characterId)[0];
    var summary;
    if (character.playerType().key === PlayerTypes.dmPlayerType.key) {
        var campaign = Campaign.findBy(character.key())[0];
        summary = PlayerSummary.fromCampaign(campaign);    
    } else {
        var profile = Profile.findBy(character.key())[0];
        summary = PlayerSummary.fromProfile(profile);
    }
    return summary;
};

/**
 * Create a player summary from a profile model.
 */
PlayerSummary.fromProfile = function(profile) {
    var summary = new PlayerSummary();
    summary.playerName(profile.playerName());
    summary.characterName(profile.characterName());
    summary.level(profile.level());
    summary.playerType(PlayerTypes.characterPlayerType);
    return summary;
};

PlayerSummary.fromCampaign = function(campaign) {
    var summary = new PlayerSummary();
    summary.playerName(campaign.dmName());
    summary.characterName(campaign.campaignName());
    summary.playerType(PlayerTypes.dmPlayerType);
    return summary;
};

