"use strict";

var PlayerInfoSignaler = {
	changed: new signals.Signal()
};

function PlayerInfoViewModel() {
	var self = this;

    self.playerInfo = ko.observable(new PlayerInfo());
    self.image = ko.observable(new ImageModel());
    
	self.init = function() {
		//Subscriptions
		self.image().dataUrl.subscribe(self.dataHasChanged);
		self.playerInfo().email.subscribe(self.dataHasChanged);		
	};

	self.load = function() {
		var image = ImageModel.findBy(CharacterManager.activeCharacter().key());
		if (image.length > 0) {
			self.image(image[0]);
		} else {
		    self.image(new ImageModel());
		}
		self.image().characterId(CharacterManager.activeCharacter().key());

		var info = PlayerInfo.findBy(CharacterManager.activeCharacter().key());
		if (info.length > 0) {
			self.playerInfo(info[0]);
		} else {
		    self.playerInfo(new PlayerInfo());
		}
		self.playerInfo().characterId(CharacterManager.activeCharacter().key());
	};

	self.unload = function() {
		self.image().save();
		self.playerInfo().save();
	};
	
	self.dataHasChanged = function() {
		self.image().save();
		self.playerInfo().save();
		PlayerInfoSignaler.changed.dispatch();
	};
	
	//Public Methods

	self.clear = function() {
		self.image().clear();
		self.playerInfo().clear();
	};
	
	self.imageBorderClass = ko.pureComputed(function() {
	    return self.hasImage() ? 'no-border' : ''
	});
	
	//Player Image Handlers
	
	self.hasImage = ko.computed(function() {
	    if (self.image().hasData()) {
	        return true;
	    } else if (self.playerInfo().email()) {
	        return true;
	    } else {
	        return false;
	    }
	});
	
	self.playerImageSrc = ko.computed(function() {
	    if (self.image().hasData()) {
	        return self.image().imageUrl();
	    } else if (self.playerInfo().email()) {
	        return self.playerInfo().gravatarUrl();
	    } else {
	        return '';
	    }
	});

	self.playerImageHeight = ko.computed(function() {
	    if (self.image().hasData()) {
	        return self.image().height();
	    } else if (self.playerInfo().email()) {
	        return '80px';
	    } else {
	        return '';
	    }
	});

	self.playerImageWidth = ko.computed(function() {
	    if (self.image().hasData()) {
	        return self.image().width();
	    } else if (self.playerInfo().email()) {
	        return '80px';
	    } else {
	        return '';
	    }
	});
};
