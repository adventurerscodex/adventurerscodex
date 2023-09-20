// import { WizardIntroStepViewModel } from 'charactersheet/viewmodels/common/wizard/steps/wizard_intro_step'
import { Notifications } from 'charactersheet/utilities/notifications';

/**
 * A global list of settings and static values.
 */
export var Settings = {
    /**
     * A series of values to always ignore when mapping KO Objects.
     */
    mappingAlwaysIgnore: ['__id', 'ps', '__ko_mapping__'],

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
};
