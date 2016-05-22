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
};
