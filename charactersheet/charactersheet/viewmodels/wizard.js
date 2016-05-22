'use strict';

function WizardViewModel() {
    var self = this;

    self.STEPS = ['type', 'info'];

    self.type = ko.observable();
    self.playerInfo = ko.observable(new PlayerInfo());

    self.fileContents = ko.observable();
    self.fileReader = new FileReader();

    self.profile = ko.observable(new Profile());
    self.campaign = ko.observable(new Campaign());
    self.currentStep = ko.observable(0);

    //UI Handlers

    self.showPrevButton = ko.pureComputed(function() {
        return self.currentStep() > 0;
    });

    self.showQuestion1 = ko.pureComputed(function() {
        return self.currentStep() === 0;
    });

    self.showQuestion2 = ko.pureComputed(function() {
        return self.currentStep() === 1;
    });

    self.showProfile = ko.pureComputed(function() {
        return self.currentStep() > 0 && self._isPlayer();
    });

    self.showCampaign = ko.pureComputed(function() {
        return self.currentStep() > 0 && self._isDM();
    });

    self.setPlayerType = function() {
        self.type(PlayerTypes.characterPlayerType);
        self.nextStep();
    };

    self.setDMType = function() {
        self.type(PlayerTypes.dmPlayerType);
        self.nextStep();
    };

    //Step Management

    self.nextStep = function() {
        self.currentStep(self.currentStep() + 1);
    };

    self.prevStep = function() {
        self.currentStep(self.currentStep() - 1);
    };

    /**
     * Returns if all of the required data is entered.
     */
    self.complete = ko.pureComputed(function() {
        var complete = false;
        if (self._isPlayer()) {
            complete = (self.profile().characterName() &&
                self.profile().playerName());
        } else if (self._isDM()) {
            complete = (self.campaign().campaignName() &&
                self.campaign().dmName());
        }
        return self.currentStep() > 0 && complete;
    });

    /**
     * Saves the newly created character to the database and alerts
     * the rest of the application.
     */
    self.submit = function() {
        var character;
        if (self._isDM()) {
            character = self._saveDM();
        } else {
            character = self._savePlayer();
        }
        CharacterManager.changeCharacter(character.key());
        self.clear();
        self.currentStep(0);
    };

    self.clear = function() {
        self.profile(new Profile());
        self.campaign(new Campaign());
    };

    self.importFromFile = function() {
        //The first comma in the result file string is the last
        //character in the string before the actual json data
        var length = self.fileReader.result.indexOf(',') + 1;
        var values = JSON.parse(atob(self.fileReader.result.substring(
            length, self.fileReader.result.length)));

        var character = Character.importCharacter(values);
        Notifications.characters.changed.dispatch();

        CharacterManager.changeCharacter(character.key());
        self.clear();
        self.currentStep(0);
    };

    self.importRemoteFile = function(data) {
        var character = Character.importCharacter(data);
        Notifications.characters.changed.dispatch();

        CharacterManager.changeCharacter(character.key());
        $('#importModal').modal('hide');
    };

    var dropboxConfigOptions = {
    // Required. Called when a user selects an item in the Chooser.
    success: function(files) {
        $.getJSON(files[0].link).done(function(data) {
            self.importRemoteFile(data);
        }).error(function(err) {
            console.log("There was an issue")
        });
    },
    // Optional. Called when the user closes the dialog without selecting a file
    // and does not include any parameters.
    cancel: function() {

    },
    // Optional. "preview" (default) is a preview link to the document for sharing,
    // "direct" is an expiring link to download the contents of the file. For more
    // information about link types, see Link types below.
    linkType: "direct", // or "direct"
    // Optional. A value of false (default) limits selection to a single file, while
    // true enables multiple file selection.
    multiselect: false, // or true
    // Optional. This is a list of file extensions. If specified, the user will
    // only be able to select files with these extensions. You may also specify
    // file types, such as "video" or "images" in the list. For more information,
    // see File types below. By default, all extensions are allowed.
    extensions: ['.json'],
};

    var button = Dropbox.createChooseButton(dropboxConfigOptions);
    document.getElementById("dropbox-container").appendChild(button);

    //Private Methods

    self._isPlayer = function() {
        try {
            return self.type().key === PlayerTypes.characterPlayerType.key;
        } catch(err) {
            return false;
        }
    };

    self._isDM = function() {
        try {
            return self.type().key === PlayerTypes.dmPlayerType.key;
        } catch(err) {
            return false;
        }
    };

    self._saveDM = function() {
        var character = new Character();
        character.key(uuid.v4());
        character.playerType(self.type());

        if (!CharacterManager.defaultCharacter()) {
            character.isDefault(true);
        }
        character.save();

        self.campaign().characterId(character.key());
        self.campaign().save();

        self.playerInfo().characterId(character.key());
        self.playerInfo().save();

        return character;
    };

    self._savePlayer = function() {
        var character = new Character();
        character.key(uuid.v4());
        character.playerType(self.type());

        if (!CharacterManager.defaultCharacter()) {
            character.isDefault(true);
        }
        character.save();

        self.profile().characterId(character.key());
        self.profile().save();

        self.playerInfo().characterId(character.key());
        self.playerInfo().save();

        return character;
    };
}
