/**
 * A global list of settings and static values.
 */
var Settings = {

    /**
     * Application's version number.
     * Used to determine which migration scripts to run.
     */
    version: '1.2.0',
    /**
     * A series of values to always ignore when mapping KO Objects.
     */
    mappingAlwaysIgnore: ['__id'],

    /**
     * A config object for dropbox integration.
     */
    dropboxConfigOptions: {
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
            url: 'https://adventurerscodex.com/data/SRD/items.json'
        }, {
            key: 'spells',
            url: 'https://adventurerscodex.com/data/SRD/spells.json'
        }, {
            key: 'armors',
            url: 'https://adventurerscodex.com/data/SRD/armor.json'
        }, {
            key: 'weapons',
            url: 'https://adventurerscodex.com/data/SRD/weapons.json'
        }, {
            key: 'magicItems',
            url: 'https://adventurerscodex.com/data/SRD/magic_items.json'
        }
    ]
};
