/**
 * A global list of settings and static values.
 */
var Settings = {

    /**
     * Application's version number.
     * Used to determine which migration scripts to run.
     */
    version: '1.4.3',
    /**
     * A series of values to always ignore when mapping KO Objects.
     */
    mappingAlwaysIgnore: ['__id'],

    /**
     * The App's Client ID for the API.
     */
    CLIENT_ID: '5vkLTV59I383qojsDTAlgYWuM0uuCfHTf9G0HAeD',

    /**
     * The URL of the host application.
     */
    HOST_URL: 'https://app.adventurerscodex.com/charactersheet/',

    /**
     * The HOST URL of the pubsub services.
     */
    PUBSUB_HOST_JID: 'pubsub.adventurerscodex.com',

    /**
     * The MUC Service URL.
     */
    MUC_SERVICE: 'chat.adventurerscodex.com',

    /**
     * A config object for dropbox integration.
     */
    dropboxPickerConfigOptions: {
        // Required. Called when a user selects an item in the Chooser.
        success: function(files) {
            WizardIntroStepViewModel.importRemoteFile(files);
        },
        // Optional. Called when the user closes the dialog without selecting a file
        // and does not include any parameters.
        cancel: function() {},
        // Optional. "preview" (default) is a preview link to the document for sharing,
        // "direct" is an expiring link to download the contents of the file. For more
        // information about link types, see Link types below.
        linkType: 'direct', // or "direct"
        // Optional. A value of false (default) limits selection to a single file, while
        // true enables multiple file selection.
        multiselect: false, // or true
        // Optional. This is a list of file extensions. If specified, the user will
        // only be able to select files with these extensions. You may also specify
        // file types, such as "video" or "images" in the list. For more information,
        // see File types below. By default, all extensions are allowed.
        extensions: ['.json']
    },

    dropboxSaveOptions: {
        // Success is called once all files have been successfully added to the user's
        // Dropbox, although they may not have synced to the user's devices yet.
        success: function () {
            Notifications.userNotification.successNotification.dispatch('Success! File saved to your Dropbox.', '');
        },

        // Progress is called periodically to update the application on the progress
        // of the user's downloads. The value passed to this callback is a float
        // between 0 and 1. The progress callback is guaranteed to be called at least
        // once with the value 1.
        progress: function (progress) {},

        // Cancel is called if the user presses the Cancel button or closes the Saver.
        cancel: function () {},

        // Error is called in the event of an unexpected response from the server
        // hosting the files, such as not being able to find a file. This callback is
        // also called if there is an error on Dropbox or if the user is over quota.
        error: function (errorMessage) {
            Notifications.userNotification.dangerNotification.dispatch('There was an error exporting your character or campaign to Dropbox. Please try again.','');
        }
    },

    /**
     * Override for default linkify options.
     * Documentation: http://soapbox.github.io/linkifyjs/docs/
     * More options: http://soapbox.github.io/linkifyjs/docs/options.html
     */
    linkifyOptions : {
        format: {
            url: function (value) {
                return value.length > 50 ? value.slice(0, 50) + '…' : value;
            }
        }
    },

    /**
     * A set of Data Repository URLs and Keys. Each item in this list should
     * contain both a URL and a Key.
     *
     * These values are fetched during initialization and the fetched values
     * are set to DataRepository[key].
     */
    srdDataRepositoryLocations: [
        {
            key: 'items',
            url: 'https://adventurerscodex.com/data/SRD/items.min.json'
        }, {
            key: 'spells',
            url: 'https://adventurerscodex.com/data/SRD/spells.min.json'
        }, {
            key: 'armors',
            url: 'https://adventurerscodex.com/data/SRD/armor.min.json'
        }, {
            key: 'weapons',
            url: 'https://adventurerscodex.com/data/SRD/weapons.min.json'
        }, {
            key: 'magicItems',
            url: 'https://adventurerscodex.com/data/SRD/magic_items.min.json'
        }, {
            key: 'monsters',
            url: 'https://adventurerscodex.com/data/SRD/monsters.min.json'
        }, {
            key: 'proficiencies',
            url: 'https://adventurerscodex.com/data/SRD/proficiencies.min.json'
        }, {
            key: 'feats',
            url: 'https://adventurerscodex.com/data/SRD/feats.min.json'
        }, {
            key: 'features',
            url: 'https://adventurerscodex.com/data/SRD/features.min.json'
        }, {
            key: 'traits',
            url: 'https://adventurerscodex.com/data/SRD/traits.min.json'
        }, {
            key: 'nouns',
            url: 'https://adventurerscodex.com/data/misc/fantasy_nouns.json'
        }, {
            key: 'adjectives',
            url: 'https://adventurerscodex.com/data/misc/fantasy_adjectives.json'
        }
    ]
};
