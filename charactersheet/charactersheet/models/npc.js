function NPC() {
    var self = this;
    self.ps = PersistenceService.register(NPC, self);

    self.characterId = ko.observable(null);
    self.npcId = ko.observable(uuid.v4());
    
    self.profile = new Profile();
    self.appearance = new CharacterAppearance();
    self.health = new Health();
    self.otherStats = new OtherStats();
    self.abilityScores = new AbilityScores();
    self.treasure = new Treasure();
    self.notes = new Note();
    
    self.load = function() {
        var key = CharacterManager.activeCharacter().key();
        self.characterId(key);
        //Load constituent models.
        var profile = Profile.findBy(self.npcId());
        if (profile.length > 0) {
            self.profile = profile[0];
        }
        self.profile.characterId(self.npcId());
        
        var appearance = CharacterAppearance.findBy(self.npcId());
        if (appearance.length > 0) {
            self.appearance = appearance[0];
        }    
        self.appearance.characterId(self.npcId());
            
        var health = Health.findBy(self.npcId());
        if (health.length > 0) {
            self.health = health[0];
        }        
        self.health.characterId(self.npcId());

        var otherStats = OtherStats.findBy(self.npcId());
        if (otherStats.length > 0) {
            self.otherStats = otherStats[0];
        }        
        self.otherStats.characterId(self.npcId());

        var abilityScores = AbilityScores.findBy(self.npcId());
        if (abilityScores.length > 0) {
            self.abilityScores = abilityScores[0];
        }        
        self.abilityScores.characterId(self.npcId());

        var treasure = Treasure.findBy(self.npcId());
        if (treasure.length > 0) {
            self.treasure = treasure[0];
        }        
        self.treasure.characterId(self.npcId());

        var notes = Note.findBy(self.npcId());
        if (notes.length > 0) {
            self.notes = notes[0];
        }        
        self.notes.characterId(self.npcId());
    };
      
    self.clear = function() {
        self.profile.clear();
        self.appearance.clear();
        self.abilityScores.clear();
        self.health.clear();
        self.treasure.clear();
        self.notes.clear();
    };

    self.importValues = function(values) {
        self.characterId(values.characterId);       
        self.npcId(values.npcId);
    };

    self.exportValues = function() {
        return {
            characterId: self.characterId(),
            npcId: self.npcId()
        };
    };
    
    self.save = function() {
        //Save constituent models.
        self.profile.save();
        self.appearance.save();
        self.health.save();
        self.otherStats.save();
        self.abilityScores.save();
        self.treasure.save();
        self.notes.save();
    
        self.ps.save();
    };
}

NPC.findAllBy = function(characterId) {
    return PersistenceService.findAll(NPC).filter(function(e, i, _) {
        return e.characterId() === characterId;
    });
};
