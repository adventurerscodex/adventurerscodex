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
import Clipboard from 'clipboard';
import { Settings } from 'charactersheet/settings';
import URI from 'urijs';
import ko from 'knockout';

/**
 * This global function handles initializing the Knockout Application
 * and set up the environment.
 */
export var init = function(viewModel) {
    // Always ignore values in this list when mapping.
    ko.mapping.defaultOptions().ignore = Settings.mappingAlwaysIgnore;

    // Set global URI settings.
    URI.fragmentPrefix = '';

    // Import static data
    Settings.srdDataRepositoryLocations.forEach(function(location, idx, _) {
        $.getJSON(location.url, function(data) {
            DataRepository[location.key] = data.values;
            if (location.key === 'features') {
                DataRepository[location.key + 'DisplayNames'] = data.values.map(function(item, idx, _){
                    return item.displayName;
                });
            }
        });
    });

    // Run migration
    PersistenceService.migrate(Migrations.scripts, VERSION);

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
    XMPPService.sharedService();
    StatusService.sharedService();
    AuthenticationServiceManager.sharedService();
    UserServiceManager.sharedService();
    NodeServiceManager.sharedService();
    ChatServiceManager.sharedService();
    NotificationsServiceManager.sharedService();

    window.hotkeyHandler = HotkeysService.hotkeyHandler;

    // Initialize the View Model
    viewModel.init();
};
