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
        longRest: new Signal()
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
        changed: new Signal()
    },

    characters: {
        changed: new Signal(),
        allRemoved: new Signal()
    },

    chat: {
        message: new Signal(),
        iq: new Signal(),
        presence: new Signal(),
        room: new Signal(),
        member: {
            joined: new Signal(),
            left: new Signal()
        }
    },
    deathsave: {
        changed: new Signal()
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

    note: {
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
        /**
         * The first parameter is the node you have joined and the second parameter is a boolean
         * that determines if you successfully connected to the party.
         */
        joined: new Signal(),
        left: new Signal(),
        roster: {
            changed: new Signal()
        },
        /**
         * A new player update is available.
         * NOTE: The first parameter is the list of pCards.
         */
        players: {
            changed: new Signal()
        }
    },

    playerImage: {
        changed: new Signal()
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
        changed: new Signal(),
        healthiness: {
            changed: new Signal()
        },
        magic: {
            changed: new Signal()
        },
        tracked: {
            changed: new Signal()
        }
    },

    trait: {
        added: new Signal(),
        changed: new Signal(),
        deleted: new Signal()
    },

    tracked: {
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

    /**
     * Messaging Notifications
     */

    xmpp: {
        /**
         * Dispatched when a new connection object has been created, but before
         * it is connected to the service.
         */
        initialized: new Signal(),
        /**
         * Dispatched when the XMPP connection is successfully established,
         * the given user is authenticated, and the connection is now usable.
         */
        connected: new Signal(),
        /**
         * Dispatched when the XMPP connection has been successfully terminated.
         * @param shouldNotify {bool} whether the event deserves to notify the user.
         */
        disconnected: new Signal(),
        reconnected: new Signal(),
        error: new Signal(),
        conflict: new Signal(),

        routes: {
            chat: new Signal(),
            pcard: new Signal()
        },

        pubsub: {
            created: new Signal(),
            subscribed: new Signal(),
            unsubscribed: new Signal()
        }
    }
};
