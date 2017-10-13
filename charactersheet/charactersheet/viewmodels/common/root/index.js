import ko from 'knockout'
import 'bin/knockout-bootstrap-modal'

import { CharacterManager, Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'
import { Character } from 'charactersheet/models/common'
import 'charactersheet/viewmodels/common/character_picker'
import 'charactersheet/viewmodels/common/characters'

import navLogo from 'images/logo-full-circle-icon.png'
import style from 'style/site.css'


/**
 * All of the possible states that the app globally can render.
 */
var APP_STATE = {
    /**
     * A character/dm has been chosen to load and the normal workflow is available.
     */
    CHOSEN: 'app',
    /**
     * No character/dm was chosen, or none exists and the wizard should be shown.
     */
    WIZARD: 'wizard',
    /**
     * No character/dm has been chosen and the app should present the user
     * with the available options
     */
    SELECT: 'select'
};

/**
 * The Root View Model for the application. All other view models are children of this view model.
 * This view model contains the global import/export functionality for player data as well as the
 * UI helpers for page layout and design.
 */
export function AdventurersCodexViewModel() {
    var self = this;

    /**
     * Once the app is ready to be displayed and all data has been loaded,
     * and the init process has finished.
      */
    self.state = ko.observable(APP_STATE.SELECT);
    self.selectedCharacter = ko.observable();
    self._dummy = ko.observable();
    self.partyManagerModalStatus = ko.observable(false);
    self.characterAndGamesModalStatus = ko.observable(false);
    self.navLogo = navLogo;

    //UI Methods

    self.showWizard = function() {
        //Unload the prior character.
        self.state(APP_STATE.WIZARD);
        if (CharacterManager.activeCharacter()) {
            self.unload();
        }
        self.load();
    };

    self.shouldShowApp = ko.pureComputed(function() {
        return self.state() == APP_STATE.CHOSEN;
    });

    self.shouldShowWizard = ko.pureComputed(function() {
        return self.state() == APP_STATE.WIZARD;
    });

    self.shouldShowPicker = ko.pureComputed(function() {
        return self.state() == APP_STATE.SELECT;
    });

    //Public Methods

    /**
     * Call Init on each sub-module.
     */
    self.init = function() {
        //Subscriptions
        Notifications.characters.allRemoved.add(self._handleAllCharactersRemoved);
        Notifications.characterManager.changing.add(self._handleChangingCharacter);
        Notifications.characterManager.changed.add(self._handleChangedCharacter);

        var characters = PersistenceService.findAll(Character);
        if (characters.length > 0) {
            self.state(APP_STATE.SELECT);
        } else {
            //If no current character exists, fire the load process anyway.
            self.state(APP_STATE.WIZARD);
        }
        self.load();
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        self._dummy.valueHasMutated();
    };

    self.unload = function() {
        self._purgeStrayDBEntries();
    };

    self.togglePartyManagerModal = function() {
        self.partyManagerModalStatus(true);
    };

    self.toggleCharacterAndGamesModal = function() {
        self.characterAndGamesModalStatus(true);
    };

    self.partyModalFinishedClosing = function() {
        self.partyManagerModalStatus(false);
    };

    // Private Methods

    self._handleAllCharactersRemoved = function() {
        self.showWizard();
    };

    self._handleChangingCharacter = function() {
        //Don't save an empty character.
        if (CharacterManager.activeCharacter() && self.state() == APP_STATE.CHOSEN) {
            self.unload();
        }
    };

    self._handleChangedCharacter = function() {
        self.selectedCharacter(CharacterManager.activeCharacter());
        self.state(APP_STATE.CHOSEN);
        try {
            self.load();
        } catch(err) {
            throw err;
        }
    };

    self._hasAtLeastOneCharacter = function() {
        return PersistenceService.findAll(Character).length > 0;
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
            if (!window[table] || table === 'Character' || table === 'AuthenticationToken') { return; }
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
