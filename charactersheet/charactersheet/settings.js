/**
 * A global list of settings and static values.
 */
var Settings = {

    /**
     * Application's version number.
     * Used to determine which migration scripts to run.
     */
    version: '1.0.2',
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
    }
};
