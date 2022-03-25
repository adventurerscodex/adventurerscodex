import { Signal } from 'signals';

/**
 * A central repository of used in Adventurer's Codex
 * To be notified of changes to an outside module, subscribe to a
 * given notification.
 */

export var Notifications = {

    /*****************************
     ***** Application Events ****
     *****************************/

    global: {

        /**
         * Called when the app should initialize.
         */
        init: new Signal(),

        /**
         * Called when the app should load it's data.
         */
        load: new Signal(),

        /**
         * Called when the app should save it's data.
         */
        save: new Signal(),

        /**
         * Called when the app should unload it's data.
         */
        unload: new Signal()
    },

    authentication: {
        loggedIn: new Signal()
    },

    user: {
        exists: new Signal()
    },

    userNotification: {
        /**
         * Notifies the user of changes.
         * REQUIRES: message parameter
         */
        infoNotification: new Signal(),

        /**
         * Notifies the user of a successful action.
         * REQUIRES: message parameter
         */
        successNotification: new Signal(),

        /**
         * Notifies the user of a warning.
         * REQUIRES: message parameter
         */
        warningNotification: new Signal(),

        /**
         * Notifies the user of something critical.
         * REQUIRES: message parameter
         */
        dangerNotification: new Signal()
    },

    coreManager: {
        changing: new Signal(),
        changed: new Signal()
    },

    /*****************************
     ****** In Game Events *******
     *****************************/

    events: {

        /**
         * Fired whenever a short rest is activated.
         */
        shortRest: new Signal(),

        /**
         * Fired whenever a long rest is activated.
         */
        longRest: new Signal(),

        /**
         * Fired whenever dawn has come.
         */
        dawn: new Signal()
    },

    /*****************************
     **** Data Changed Events ****
     *****************************/

    actionsToolbar: {
        toggle: new Signal()
    },

    abilityscore: {
        changed: new Signal()
    },

    armor: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    armorClass: {
        changed: new Signal()
    },

    campaign: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal(),
        playerName: {
            changed: new Signal()
        },
        summary: {
            changed: new Signal()
        },
        playerType: {
            changed: new Signal()
        }
    },

    characters: {
        changed: new Signal(),
        allRemoved: new Signal()
    },

    deathsave: {
        changed: new Signal()
    },

    encounter: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    encounterimage: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    exhibit: {
        changed: new Signal()
    },

    feat: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    feature: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    health: {
        changed: new Signal()
    },

    hitdice: {
        changed: new Signal()
    },

    hitDiceType: {
        changed: new Signal()
    },

    image: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    item: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    magicitem: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    monster: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    note: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    npc: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    encounters: {
        changed: new Signal()
    },

    otherstats: {
        changed: new Signal()
    },

    party: {
        changed: new Signal(),
        connecting: new Signal(),
        connected: new Signal(),
        disconnected: new Signal(),
    },

    companion: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },
    playerimage: {
        changed: new Signal()
    },

    pointofinterest: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    profile: {
        changed: new Signal(),
        playerName: {
            changed: new Signal()
        },
        playerSummary: {
            changed: new Signal()
        },
        playerType: {
            changed: new Signal()
        }
    },

    proficiency: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    proficiencyBonus: {
        changed: new Signal()
    },

    playertext: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    sessionExpired: {
        changed: new Signal()
    },

    settings: {
        changed: new Signal()
    },

    skill: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    spellslot: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    spellstats: {
        changed: new Signal()
    },

    spell: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    stats: {
        changed: new Signal()
    },

    status: {
        changed: new Signal()
    },

    trait: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    trap: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    tracked: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    treasure: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    weapon: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    wealth: {
        changed: new Signal()
    },

    wizard: {
        /**
         * Dispatched when the Wizard has completed making a character.
         */
        completed: new Signal()
    },
};
