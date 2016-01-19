"use strict";

function WizardViewModel() {
    var self = this;
    
    self.profile = ko.observable(new Profile());
    
    
    /**
     * Returns if all of the required data is entered.
     */
    self.complete = ko.pureComputed(function() {
        
    
    });

    
    /**
     * Saves the newly created character to the database and alerts
     * the rest of the application.
     */
    self.submit = function() {
		var character = new Character();
		character.key(uuid.v4());
		character.playerType(PlayerTypes.characterPlayerType);
		
		if (!CharacterManager.defaultCharacter()) {
			character.isDefault(true);
		}
		character.isActive(true);
		character.save();
		
		self.profile().characterId(character.key());
        self.profile().save();
        CharacterManager.changeCharacter(character.key());
        self.profile(new Profile());
    };
};
