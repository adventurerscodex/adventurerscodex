import $ from 'jquery'
import ko from 'knockout'
import URI from 'urijs'
import Clipboard from 'clipboard'

import { Settings } from 'charactersheet/settings'
import { DataRepository,
    Migrations
} from 'charactersheet/utilities'
import { HealthinessStatusServiceComponent,
         InspirationStatusServiceComponent,
         MagicalStatusServiceComponent,
         PersistenceService,
         TotalWeightStatusServiceComponent,
         TrackedStatusServiceComponent
} from 'charactersheet/services'

import {
    AuthenticationServiceManager,
    ChatServiceManager,
    NodeServiceManager,
    NotificationsServiceManager,
    StatusService,
    UserServiceManager,
    XMPPService,
} from 'charactersheet/services/common'

/**
 * This global function handles initializing the Knockout Application
 * and set up the environment.
 */
export var init = function(viewModel) {
    // Always ignore values in this list when mapping.
//     ko.mapping.defaultOptions().ignore = Settings.mappingAlwaysIgnore;

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
    PersistenceService.migrate(Migrations.scripts, Settings.version);

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

    // Initialize the View Model
    viewModel.init();
};
