import 'bin/knockout-bootstrap-modal';
import 'charactersheet/viewmodels/common/character_picker';
import 'charactersheet/viewmodels/common/characters';
import {
    AuthenticationServiceManager,
    ChatServiceManager,
    NodeServiceManager,
    NotificationsServiceManager,
    UserServiceManager,
    XMPPService
} from 'charactersheet/services';
import {
    CoreManager,
    Notifications,
    TabFragmentManager
} from 'charactersheet/utilities';
import { Core } from 'charactersheet/models/common/core';
import { PersistenceService } from 'charactersheet/services/common';
import ko from 'knockout';
import navLogo from 'images/logo-full-circle-icon.png';
import style from 'style/site.css';


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
    self.state = ko.observable();
    self.isFinishedLoading = ko.observable(false);
    self.selectedCore = ko.observable();
    self.partyManagerModalStatus = ko.observable(false);
    self.characterAndGamesModalStatus = ko.observable(false);
    self.exportModalStatus = ko.observable(false);
    self.navLogo = navLogo;
    self.version = VERSION;
    self.buildDate = BUILD_DATE;
    self.currentYear = CURRENT_YEAR;
    self.environment = ENVIRONMENT;
    self.homeURL = HOME_URL;

    //UI Methods

    self.showWizard = function() {
        self.state(APP_STATE.WIZARD);
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
        Notifications.coreManager.changing.add(self._handleChangingCharacter);
        Notifications.coreManager.changed.add(self._handleChangedCharacter);

        // Finish the setup once we're sure that we're logged in.
        Notifications.authentication.loggedIn.add(self.doSetup);
    };

    self.doSetup = async () => {
        await CoreManager.init();
        const charactersResponse = await Core.ps.list();
        let characters = charactersResponse.objects;

        TabFragmentManager.init();

        self.isFinishedLoading(true);
        keyAndMakeVisible();
        if (CoreManager.activeCore()) {
            // There might be an active character in the URL.
            showSplashScreen();
            self._handleChangedCharacter();
        } else if (characters.length > 0) {
            self.state(APP_STATE.SELECT);
        } else {
            //If no current character exists, fire the load process anyway.
            self.state(APP_STATE.WIZARD);
        }
    };

    self.togglePartyManagerModal = function() {
        self.partyManagerModalStatus(true);
    };

    self.toggleCharacterAndGamesModal = function() {
        self.characterAndGamesModalStatus(true);
    };

    self.toggleExportModal = function() {
        self.exportModalStatus(true);
    };

    self.partyModalFinishedClosing = function() {
        self.partyManagerModalStatus(false);
    };

    // Private Methods

    self._handleAllCharactersRemoved = function() {
        self.showWizard();
    };

    self._handleChangingCharacter = function() {
        showSplashScreen();

        self.selectedCore(null);

        Hypnos.client.cache.flushAll();
        TabFragmentManager.changeTabFragment(null);
    };

    self._handleChangedCharacter = function() {
        if (self.isFinishedLoading()) {
            self.selectedCore(CoreManager.activeCore());
            self.state(APP_STATE.CHOSEN);
        }
        setTimeout(hideSplashScreen, 1000);
    };
}
