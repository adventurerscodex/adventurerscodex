'use strict';

function WizardViewModel() {
    var self = this;

    self.STEPS = ['type', 'info'];

    self.type = ko.observable();
    self.playerInfo = ko.observable(new PlayerInfo());

    self.fileContents = ko.observable();
    self.fileReader = new FileReader();

    self.profile = ko.observable(new Profile());
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

    self.setPlayerType = function() {
        self.type(PlayerTypes.characterPlayerType);
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
        }
        return self.currentStep() > 0 && complete;
    });

    /**
     * Saves the newly created character to the database and alerts
     * the rest of the application.
     */
    self.submit = function() {
        var character;
        character = self._savePlayer();
        CharacterManager.changeCharacter(character.key());
        self.clear();
        self.currentStep(0);
    };

    self.clear = function() {
        self.profile(new Profile());
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

    WizardViewModel.importRemoteFile = function(files) {
        $.getJSON(files[0].link).done(function(data) {
            var character = Character.importCharacter(data);
            Notifications.characters.changed.dispatch();

            CharacterManager.changeCharacter(character.key());
            $('#importModal').modal('hide');
        }).error(function(err) {
            //TODO: Alert user of error
        });
    };

    //Private Methods

    self._isPlayer = function() {
        try {
            return self.type().key === PlayerTypes.characterPlayerType.key;
        } catch(err) {
            return false;
        }
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
