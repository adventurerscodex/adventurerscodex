/**
 * This global function handles initializing the Knockout Application
 * and set up the environment.
 */
var init = function(viewModel) {
    // Always ignore values in this list when mapping.
    ko.mapping.defaultOptions().ignore = Settings.mappingAlwaysIgnore;

    // Import static data
    $.getJSON('https://adventurerscodex.com/data/SRD/spells.json',
        function(data) {
            DataRepository.spells = data;
        }
      );

    $.getJSON('https://adventurerscodex.com/data/SRD/items.json',
        function(data) {
            DataRepository.items = data;
        }
      );

    // Run migration
    PersistenceService.migrate(Fixtures.migration.scripts, Settings.version);

    // Initialize the View Model
    viewModel.init();
};
