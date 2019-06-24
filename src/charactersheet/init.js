// Enables Async/Await
import 'babel-polyfill';
import 'bootstrap';
import 'bin/knockout-validation';
import {
    AuthenticationServiceManager,
    ChatServiceManager,
    HealthinessStatusServiceComponent,
    HotkeysService,
    InspirationStatusServiceComponent,
    MagicalStatusServiceComponent,
    NodeServiceManager,
    NotificationsServiceManager,
    PersistenceService,
    StatusService,
    TotalWeightStatusServiceComponent,
    TrackedStatusServiceComponent,
    UserServiceManager,
    XMPPService
} from 'charactersheet/services';
import {
    DataRepository,
    Migrations,
    Notifications
} from 'charactersheet/utilities';
import $ from 'jquery';
import { AuthenticationToken } from 'charactersheet/models/common/authentication_token';
import Clipboard from 'clipboard';
import { Hypnos } from 'hypnos';
import { Settings } from 'charactersheet/settings';
import URI from 'urijs';
import ko from 'knockout';

/**
 * This global function handles initializing the Knockout Application
 * and set up the environment.
 */
export var init = function(viewModel) {
    // Always ensure the user is logged in first...
    // Always ignore values in this list when mapping.
    ko.mapping.defaultOptions().ignore = Settings.mappingAlwaysIgnore;

    // Set global URI settings.
    URI.fragmentPrefix = '';

    // Import static data
    $(() => {
        Settings.srdDataRepositoryLocations.forEach(function(location, idx, _) {
            $.getJSON(location.url, function(data) {
                DataRepository[location.key] = data.values;
                if (location.key === 'features') {
                    data.values.map(function(item, idx, _) {
                        DataRepository[location.key][item.displayName] = item;
                    });
                }
            });
        });
    });

    // Run local migrations
    PersistenceService.migrate(Migrations.scripts, VERSION);

    // Set up API client configuration handlers.
    Notifications.authentication.loggedIn.add(() => {
        // After 9.5hrs, show a pop up that forces a refresh to get a new session.
        setTimeout(() => {
            Notifications.sessionExpired.changed.dispatch();
        }, 34200000);
        var token = PersistenceService.findAll(AuthenticationToken)[0];
        Hypnos.configuration = {
            credentials: {
                scheme: 'Bearer',
                token: token.accessToken()
            },
            schema: schema,
            cacheConfig: {
                stdTTL: 0
            }
        };
    });

    // Cloud Syncing import
    const importTable = localStorage.__importComplete__;
    const characterTable = localStorage.Character;

    // Only redirect if the user has NOT performed the import
    // OR if the database is empty (new user)
    let redirect = false;
    if (importTable || !characterTable) {
        redirect = false;
    } else {
        redirect = true;
    }

    // Based on the presence of the import flag, load the app or redirect to the import process
    if (redirect) {
        window.location.href = '/api/pre-cloud-syncing-debrief/';
        return;
    }

    // Initialize the View Model
    viewModel.init();

    // Clipboard initialization.
    var clipboard = new Clipboard('.btn');

    clipboard.on('success', function(e) {
        Notifications.userNotification.infoNotification.dispatch('Text copied to clipboard.', '');
        e.clearSelection();
    });

    // Set default status service components.
    StatusService.configuration.components = [
        new TotalWeightStatusServiceComponent(),
        new InspirationStatusServiceComponent(),
        new HealthinessStatusServiceComponent(),
        new TrackedStatusServiceComponent(),
        new MagicalStatusServiceComponent()
    ];

    // Prime the services.
    XMPPService.sharedService().init();
    NodeServiceManager.sharedService().init();
    ChatServiceManager.sharedService().init();
    NotificationsServiceManager.sharedService().init();
    UserServiceManager.sharedService().init();
    AuthenticationServiceManager.sharedService().init();
    StatusService.sharedService();

    window.hotkeyHandler = HotkeysService.hotkeyHandler;
    window.PersistenceService = PersistenceService;
    window.Hypnos = Hypnos;
    window.XMPPService = XMPPService;
};
