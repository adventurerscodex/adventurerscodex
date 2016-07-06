/**
 * This global function handles initializing the Knockout Application
 * and set up the environment.
 */
var init = function(viewModel) {
    //Always ignore values in this list when mapping.
    ko.mapping.defaultOptions().ignore = Settings.mappingAlwaysIgnore;


    viewModel.init();

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

    //Check if a character already exists.
    if (CharacterManager.activeCharacter()) {
        CharacterManager.changeCharacter(
            CharacterManager.activeCharacter().key());
    }

    //Initialize dropbox integrations.
    var button = Dropbox.createChooseButton(Settings.dropboxConfigOptions);
    document.getElementById('dropbox-container').appendChild(button);
};
