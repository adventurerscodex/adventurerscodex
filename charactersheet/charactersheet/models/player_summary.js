"use strict";

/**
 * A simple representation of a player to be sent over the wire.
 */
function PlayerSummary() {
    var self = this;
    
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
    
    self.importValues = function(values) {
        self.id(values.id);
        self.playerType(values.playerType);
        
        self.playerName(values.playerName);
        self.characterName(values.characterName);
        self.level(values.level);
        self.profileImage(values.profileImage);
        
        self.totalHealth(values.totalHealth);
        self.remainingHealth(values.remainingHealth);
        self.ac(values.ac);
    };
    
    self.exportValues = function() {
        return {
            id: self.id(),
            playerType: self.playerType(),
            
            playerName: self.playerName(),
            characterName: self.characterName(),
            level: self.level(),
            profileImage: self.profileImage(),
            
            totalHealth: self.totalHealth(),
            remainingHealth: self.remainingHealth(),
            ac: self.ac(),
        };
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
    } catch(err) {
        var info = PlayerInfo.findBy(key)[0];
        imageUrl = info.gravatarUrl();
    }
    summary.profileImage(imageUrl);
            
    return summary;
};
