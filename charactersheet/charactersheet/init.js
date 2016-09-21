/**
 * This global function handles initializing the Knockout Application
 * and set up the environment.
 */
var init = function(viewModel) {
    // Always ignore values in this list when mapping.
    ko.mapping.defaultOptions().ignore = Settings.mappingAlwaysIgnore;

    // Import static data
    Settings.srdDataRepositoryLocations.forEach(function(location, idx, _) {
        $.getJSON(location.url, function(data) {
            DataRepository[location.key] = data;
        });
    });

    // Run migration
    PersistenceService.migrate(Migrations.scripts, Settings.version);

    // Set default status service components.
    StatusService.configuration.components = [
        new TotalWeightStatusServiceComponent()
    ];
    StatusService.sharedService(); // Prime the service.

    // Initialize the View Model
    viewModel.init();
};
