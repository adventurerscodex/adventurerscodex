"use strict";

var PlayerImageSignaler = {
	changed: new signals.Signal()
};

function PlayerImageViewModel() {
	var self = this;

    self.image = ko.observable(new ImageModel());
    
	self.init = function() {
	};

	self.load = function() {
		var image = ImageModel.findBy(CharacterManager.activeCharacter().key());
		if (image.length > 0) {
			self.image(image[0]);
		} else {
		    self.image(new ImageModel());
		}
		self.image().characterId(CharacterManager.activeCharacter().key());

		//Subscriptions
		self.image().dataUrl.subscribe(self.dataHasChanged);
		PlayerInfoSignaler.changed.add(self.checkImage);
	};

	self.unload = function() {
		self.image().save();
	};
	
	self.dataHasChanged = function() {
	    //Remove the old email.
		var info = PlayerInfo.findBy(CharacterManager.activeCharacter().key());
        try {
            info[0].clear();
        } catch(err) {};
        return false;

		self.image().save();
		PlayerImageSignaler.changed.dispatch();
	};
	
	/**
	 * Whenever the player's email changes, re-evaluate if/what image 
	 * should be shown. 
	 */
	self.checkImage = function() {
		var info = PlayerInfo.findBy(CharacterManager.activeCharacter().key());
        try {
            var email = info[0].email();
            if (email) {
                self.image().imageUrl(info[0].gravatarUrl());
                PlayerImageSignaler.changed.dispatch();
            }
        } catch(err) {};
        return false;
	};
	
	//Public Methods

	self.clear = function() {
		self.image().clear();
	};
	
	self.imageBorderClass = ko.pureComputed(function() {
	    return self.hasImage() ? 'no-border' : ''
	});
	
	//Player Image Handlers
	
	self.hasImage = ko.computed(function() {
	    if (self.image().hasData()) {
	        return true;
	    } else {
	        return false;
	    }
	});
	
	self.playerImageSrc = ko.computed(function() {
	    if (self.image().hasData()) {
	        return self.image().imageUrl();
	    } else {
	        return '';
	    }
	});

	self.playerImageHeight = ko.computed(function() {
	    if (self.image().hasData()) {
	        return self.image().height();
	    } else {
	        return '';
	    }
	});

	self.playerImageWidth = ko.computed(function() {
	    if (self.image().hasData()) {
	        return self.image().width();
	    } else {
	        return '';
	    }
	});
};
