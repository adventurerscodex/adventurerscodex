'use strict';

/**
 * The Root View Model for the application. All other view models are children of this view model.
 * This view model contains the global import/export functionality for player data as well as the
 * UI helpers for page layout and design.
 */
function AdventurersCodexViewModel() {
    var self = this;

    /**
     * Once the app is ready to be displayed and all data has been loaded,
     * and the init process has finished.
      */
    self.ready = ko.observable(false);
    self._dummy = ko.observable();

    // View Models
    self.childRootViewModel = ko.observable();
    self.wizardViewModel = new WizardViewModel();
    self.userNotificationViewModel = new UserNotificationViewModel();
    self.charactersViewModel = new CharactersViewModel();

    //UI Methods

    self.showWizard = function() {
        //Unload the prior character.
        if (CharacterManager.activeCharacter()) {
            self.unload();
        }
        self.ready(false);
    };

    //Public Methods

    /**
     * Call Init on each sub-module.
     */
    self.init = function() {
        self.userNotificationViewModel.init();
        self.charactersViewModel.init();
        self.wizardViewModel.init();

        //Subscriptions
        Notifications.characters.allRemoved.add(self._handleAllCharactersRemoved);
        Notifications.characterManager.changing.add(self._handleChangingCharacter);
        Notifications.characterManager.changed.add(self._handleChangedCharacter);

        var character = Character.findAll()[0];
        if (character) {
            //Switching characters will fire the load notification.
            CharacterManager.changeCharacter(character.key());
        } else {
            //If no current character exists, fire the load process anyway.
            self.load();
        }
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        if (CharacterManager.activeCharacter()) {
            self.childRootViewModel().load();
            self.userNotificationViewModel.load();
            self.charactersViewModel.load();
            self.ready(true);
        } else {
            self.wizardViewModel.load();
        }
        self._dummy.valueHasMutated();
    };

    self.unload = function() {
        if (CharacterManager.activeCharacter()) {
            self.childRootViewModel().unload();
            self.userNotificationViewModel.unload();
            self.charactersViewModel.unload();
            self.wizardViewModel.unload();
        }

        self._purgeStrayDBEntries();
    };

    //Private Methods

    self._setNewCharacter = function(character) {
        // Init the correct view model for each type.
        var vm = character.playerType().rootViewModel;
        self.childRootViewModel(new vm());
        self.childRootViewModel().init();
    };

    self._handleAllCharactersRemoved = function() {
        self.showWizard();
    };

    self._handleChangingCharacter = function() {
        //Don't save an empty character.
        if (CharacterManager.activeCharacter() && self.ready()) {
            self.unload();
        }
    };

    self._handleChangedCharacter = function() {
        self._setNewCharacter(CharacterManager.activeCharacter());
        try {
            self.load();
        } catch(err) {
            throw err;
        }
    };

    self._hasAtLeastOneCharacter = function() {
        return Character.findAll().length > 0;
    };

    /**
     * Clear stray db entries. Entries that are either belonging to a
     * non-existant or null character are removed.
     */
    self._purgeStrayDBEntries = function() {
        var activeIDs = PersistenceService.findAll(Character).map(function(character, _i, _) {
            return  character.key();
        });
        PersistenceService.listAll().forEach(function(table, idx, _) {
            if (!window[table] || table === 'Character') { return; }
            PersistenceService.findAllObjs(table).forEach(function(e1, i1,_1) {
                var invalidID = e1.data['characterId'] === undefined || e1.data['characterId'] === null;
                var expiredID = activeIDs.indexOf(e1.data['characterId']) === -1;
                if (expiredID || invalidID) {
                    PersistenceService.delete(window[table], e1.id);
                }
            });
        });
    };
}
