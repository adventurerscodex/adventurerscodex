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
            url: 'https://adventurerscodex.com/data/v2/SRD/items.min.json'
        }, {
            key: 'spells',
            url: 'https://adventurerscodex.com/data/v2/SRD/spells.min.json'
        }, {
            key: 'armors',
            url: 'https://adventurerscodex.com/data/v2/SRD/armor.min.json'
        }, {
            key: 'weapons',
            url: 'https://adventurerscodex.com/data/v2/SRD/weapons.min.json'
        }, {
            key: 'magicItems',
            url: 'https://adventurerscodex.com/data/v2/SRD/magic_items.min.json'
        }, {
            key: 'monsters',
            url: 'https://adventurerscodex.com/data/v2/SRD/monsters.min.json'
        }, {
            key: 'proficiencies',
            url: 'https://adventurerscodex.com/data/v2/SRD/proficiencies.min.json'
        }, {
            key: 'feats',
            url: 'https://adventurerscodex.com/data/v2/SRD/feats.min.json'
        }, {
            key: 'features',
            url: 'https://adventurerscodex.com/data/v2/SRD/features.min.json'
        }, {
            key: 'traits',
            url: 'https://adventurerscodex.com/data/v2/SRD/traits.min.json'
        }, {
            key: 'nouns',
            url: 'https://adventurerscodex.com/data/misc/fantasy_nouns.json'
        }, {
            key: 'adjectives',
            url: 'https://adventurerscodex.com/data/misc/fantasy_adjectives.json'
        }, {
            key: 'backpacks',
            url: 'https://adventurerscodex.com/data/v2/SRD/backpacks.min.json'
        }, {
            key: 'traps',
            url: 'https://adventurerscodex.com/data/v2/SRD/traps.min.json'
        }, {
            key: 'names',
            url: 'https://adventurerscodex.com/data/misc/names.json'
        }, {
            key: 'pointsOfInterest',
            url: 'https://adventurerscodex.com/data/misc/points_of_interest.json'
        }
    ]
};
