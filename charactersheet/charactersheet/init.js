/**
 * This global function handles initializing the Knockout Application
 * and set up the environment.
 */
var init = function(viewModel) {
    messenger = new Messenger();
    players = new PlayersService();
    playerSummaryService = new PlayerSummaryService();

    messenger.connect();
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

        players.init();
        playerSummaryService.init();
    });

    //Check if a character already exists.
    if (CharacterManager.activeCharacter()) {
        CharacterManager.changeCharacter(
            CharacterManager.activeCharacter().key());
    }

    var dropboxConfigOptions = {
    // Required. Called when a user selects an item in the Chooser.
    success: function(files) {
        WizardViewModel.importRemoteFile(files)
    },
    // Optional. Called when the user closes the dialog without selecting a file
    // and does not include any parameters.
    cancel: function() {

    },
    // Optional. "preview" (default) is a preview link to the document for sharing,
    // "direct" is an expiring link to download the contents of the file. For more
    // information about link types, see Link types below.
    linkType: "direct", // or "direct"
    // Optional. A value of false (default) limits selection to a single file, while
    // true enables multiple file selection.
    multiselect: false, // or true
    // Optional. This is a list of file extensions. If specified, the user will
    // only be able to select files with these extensions. You may also specify
    // file types, such as "video" or "images" in the list. For more information,
    // see File types below. By default, all extensions are allowed.
    extensions: ['.json'],
};

    var button = Dropbox.createChooseButton(dropboxConfigOptions);
    document.getElementById("dropbox-container").appendChild(button);
};
