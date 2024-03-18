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
