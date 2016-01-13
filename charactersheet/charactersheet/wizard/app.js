"use strict";

function WizardViewModel() {
    var self = this;
    
    self.profile = new Profile();
    
    self.submit = function() {
		CharacterManagerSignaler.changing.dispatch();
		var character = new Character();
		character.key(uuid.v4());
		character.playerType(PlayerTypes.characterPlayerType);
		
		if (!CharacterManager.defaultCharacter()) {
			character.isDefault(true);
		}
		character.isActive(true);
		character.save();
		
		self.profile.characterId(character.key());
		console.log(self.profile.characterName(), self.profile.characterId());
        self.profile.save();
		CharacterManagerSignaler.changed.dispatch();
    };
};
