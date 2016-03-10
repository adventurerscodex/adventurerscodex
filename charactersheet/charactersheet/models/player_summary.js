"use strict";

/**
 * A simple representation of a player to be sent over the wire.
 */
function PlayerSummary() {
    var self = this;
    self.mapping = {
	    ignore: ['clear', 'importValues', 'exportValues']
    };

    self.id = ko.observable(null);
    self.playerType = ko.observable();

    //Profile
    self.playerName = ko.observable();
    self.characterName = ko.observable();
    self.level = ko.observable();
    self.profileImage = ko.observable();

    //Stats
    self.totalHealth = ko.observable();
    self.remainingHealth = ko.observable();
    self.ac = ko.observable();

    self.clear = function() {
        var values = new Item().exportValues();
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.importValues = function(values) {
        ko.mapping.fromJS(values, self.mapping, self);
    };

    self.exportValues = function() {
        return ko.mapping.toJS(self, self.mapping);
    };
};

PlayerSummary.findBy = function(characterId) {
    return PlayerSummary.fromKey(characterId);
};

/**
 * Create a player summary from a profile model. This model assumes that
 * a given player is NOT a DM.
 */
PlayerSummary.fromKey = function(key) {
    var summary = new PlayerSummary();

    summary.id(key);
    var character = Character.findBy(key)[0];
    summary.playerType(character.playerType().key);

    if (character.playerType().key === PlayerTypes.characterPlayerType.key) {
        var profile = Profile.findBy(key)[0];
        summary.playerName(profile.playerName());
        summary.characterName(profile.characterName());
        summary.level(profile.level());

        var health = Health.findBy(key)[0];
        summary.totalHealth(health.maxHitpoints());
        summary.remainingHealth(health.hitpoints());

        var stats = OtherStats.findBy(key)[0];
        summary.ac(stats.ac());

    } else {
        var campaign = Campaign.findBy(key)[0];
        summary.playerName(campaign.dmName());
        summary.characterName(campaign.campaignName());
    }

    var imageUrl;
    try {
        var image = ImageModel.findBy(key)[0];
        imageUrl = image.imageUrl();
    } catch(err) {};
    if (!imageUrl) {
        var info = PlayerInfo.findBy(key)[0];
        imageUrl = info.gravatarUrl();
    }

    summary.profileImage(imageUrl);

    return summary;
};
