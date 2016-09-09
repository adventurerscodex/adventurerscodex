'use strict';

function PlayerImageViewModel() {
    var self = this;

    /**
     * KO File Drag binding places new image data here, it
     * is moved to the `imageData` property on change.
     */
    self.dropzone = ko.observable({
        dataURL: ko.observable()
    });

    /**
     * The image data that is displayed. The image is fed from the dropzone.
     */
    self.imageData = ko.observable('');

    self.height = ko.observable(80);
    self.width = ko.observable(80);

    self.init = function() {
        Notifications.global.save.add(self.saveData);
    };

    self.load = function() {
        var image = ImageModel.findBy(CharacterManager.activeCharacter().key());
        if (image.length > 0) {
            self.imageData(image[0].imageUrl() || '');
        }

        //Subscriptions
        self.dropzone().dataURL.subscribe(self.dropzoneHasChanged);
        Notifications.playerInfo.changed.add(self.emailHasChanged);
    };

    self.unload = function() {
        self.saveData();
        Notifications.playerInfo.changed.remove(self.emailHasChanged);
    };

    /**
     * Whenever the dropzone changes, then use the value of that, then clear it.
     */
    self.dropzoneHasChanged = function() {
        var dropzoneData = self.dropzone().dataURL();
        if (dropzoneData) {
            self.imageData(dropzoneData);
            self.saveData();
            self._clearDropzone();
        }
    };

    /**
     * Whenever the player's email changes, if a valid gravatar email
     * is found, use that.
     */
    self.emailHasChanged = function() {
        if (self._playerHasValidGravatarImage()) {
            self.imageData(self._getGravatarURL());
            self.saveData();
        }
    };

    self.saveData = function() {
        var results = ImageModel.findBy(CharacterManager.activeCharacter().key());
        var image = results.length > 0 ? results[0] : new ImageModel();

        image.characterId(CharacterManager.activeCharacter().key());
        image.imageUrl(self.imageData());

        try {
            image.save();
        } catch(err) {
            alert('This image is too large to save in your storage.\n'
            + 'We will show it for now, but we will not save the image.');
        }
    };

    //Public Methods

    self.clear = function() {
        var results = ImageModel.findBy(CharacterManager.activeCharacter().key());
        if (results.length > 0) {
            results[0].clear();
        }
        self.imageData('');
    };

    self.imageBorderClass = ko.pureComputed(function() {
        return self.hasImage() ? 'no-border' : '';
    });

    //Player Image Handlers

    self.hasImage = ko.computed(function() {
        return self.imageData().length > 0;
    });

    self.playerImageSrc = ko.computed(function() {
        return self.imageData();
    });

    // Private Methods

    self._playerHasValidGravatarImage = function() {
        var email = self._getGravatarURL();
        return email ? true: false;
    };

    self._getGravatarURL = function() {
        var info = PlayerInfo.findBy(CharacterManager.activeCharacter().key());
        try {
            var email = info[0].email();
            if (email) {
                return info[0].gravatarUrl();
            }
        } catch(err) { /*Ignore*/ }
    };

    self._clearDropzone = function() {
        self.dropzone().dataURL('');
    };
}
