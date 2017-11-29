import 'bin/knockout-file-bind';
import $ from 'jquery';
import { Character } from 'charactersheet/models';
import { Settings } from 'charactersheet/settings';
import ko from 'knockout';
import logo from 'images/logo-all-icons.png';
import template from './index.html';

const dropboxPickerConfigOptions = {
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
};


export function WizardIntroStepViewModel(params) {
    var self = this;

    self.logo = logo;
    self.TEMPLATE_FILE = 'wizard_intro_step.tmpl';
    self.IDENTIFIER = 'WizardIntroStep';

    self.ready = params.stepReady;
    self.results = params.results;

    /**
     * Results for this view model contain either a `PlayerType` field,
     * or an `import` field containing the character id.
     *
     * - Possible values of Player type are: player, dm, import.
     */
    self.wellOpen = ko.observable(false);

    self.fileContents = ko.observable();
    self.fileReader = new window.FileReader();
    self.character = null;
    self.fromRemoteFile = false;

    // View Model Methods

    self.init = function() {
    };

    self.load = function() {
        //Set default value to player atm.
        self.setPlayerType('player');
        self.ready(true);
    };

    self.unload = function() {};

    self.setPlayerType = function(type) {
        self.results({ PlayerType: type });
    };

    self.toggleWellOpen = function() {
        self.wellOpen(!self.wellOpen());

        //Make sure only one dropbox button is created
        var dropboxContainer = document.getElementById('dropbox-container');
        if(dropboxContainer.childNodes.length < 1){
            var button = Dropbox.createChooseButton(dropboxPickerConfigOptions);
            dropboxContainer.appendChild(button);
        }
    };

    self.arrowIconClass = ko.pureComputed(function() {
        return self.wellOpen() ? 'fa fa-caret-up' : 'fa fa-caret-down';
    });

    self.importFromFile = function() {
        //The first comma in the result file string is the last
        //character in the string before the actual json data
        if(!self.fromRemoteFile){
            var length = self.fileReader.result.indexOf(',') + 1;
            var values = JSON.parse(decodeURIComponent(atob(
                self.fileReader.result.substring(
                    length, self.fileReader.result.length))));
            var character = Character.importCharacter(values);

            self._setImportReady(character.key());
        }
        else {
            self._setImportReady(self.character.key());
        }
    };

    WizardIntroStepViewModel.importRemoteFile = function(files) {
        try {
            $.get(files[0].link).done(function(data) {
                self.fromRemoteFile = true;
                self.character = Character.importCharacter(JSON.parse(decodeURIComponent(data)));
            });
        } catch(error) {
            Notifications.userNotification.dangerNotification.dispatch('There was an error importing your character or campaign from Dropbox. Please try again.','');
        }
    };

    // Private Methods

    /**
     * Given a character Id from an imported character, alert the
     * parent of a successful import.
     */
    self._setImportReady = function(characterId) {
        self.results({ 'import': characterId });
        self.ready(false);
        self.ready(true);
    };
}

ko.components.register('wizard-intro-step', {
    viewModel: WizardIntroStepViewModel,
    template: template
});
