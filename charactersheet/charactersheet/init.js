/**
 * This global function handles initializing the Knockout Application
 * and set up the environment.
 */
var init = function(viewModel) {
    //Always ignore values in this list when mapping.
    ko.mapping.defaultOptions().ignore = Settings.mappingAlwaysIgnore;


    //Set up event handlers.
    Notifications.characterManager.changing.add(function() {
        //Don't save an empty character.
        if (CharacterManager.activeCharacter() && viewModel.ready()) {
            Notifications.global.unload.dispatch();
        }
    });
    Notifications.characterManager.changed.add(function() {
        try {
            Notifications.global.load.dispatch();
        } catch(err) {
            throw err;
        }
    });

    // Initialize the View Model
    viewModel.init();
};
