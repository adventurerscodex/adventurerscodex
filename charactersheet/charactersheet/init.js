/**
 * This global function handles initializing the Knockout Application
 * and set up the environment.
 */
var init = function(viewModel) {
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
    PersistenceService.migrate(Migrations.scripts, Settings.version);

    // Set default status service components.
    StatusService.configuration.components = [
        new TotalWeightStatusServiceComponent(),
        new InspirationStatusServiceComponent(),
        new HealthinessStatusServiceComponent()
    ];

    // Prime the services.
    XMPPService.sharedService();
    StatusService.sharedService();
    AuthenticationServiceManager.sharedService();
    UserServiceManager.sharedService();
    NodeServiceManager.sharedService();

    // Initialize the View Model
    viewModel.init();
};
