'use strict';

/**
 * A central repository of signals used in Adventurer's Codex
 * To be notified of changes to an outside module, subscribe to a
 * given notification.
 */

var Notifications = {

    /*****************************
     ***** Application Events ****
     *****************************/

    global: {

        /**
         * Called when the app should initialize.
         */
        init: new signals.Signal(),

        /**
         * Called when the app should load it's data.
         */
        load: new signals.Signal(),

        /**
         * Called when the app should save it's data.
         */
        save: new signals.Signal(),

        /**
         * Called when the app should unload it's data.
         */
        unload: new signals.Signal()
    },

    authentication: {
        loggedIn: new signals.Signal()
    },

    user: {
        exists: new signals.Signal()
    },

    userNotification: {
        /**
         * Notifies the user of changes.
         * REQUIRES: message parameter
         */
        infoNotification: new signals.Signal(),

        /**
         * Notifies the user of a successful action.
         * REQUIRES: message parameter
         */
        successNotification: new signals.Signal(),

        /**
         * Notifies the user of a warning.
         * REQUIRES: message parameter
         */
        warningNotification: new signals.Signal(),

        /**
         * Notifies the user of something critical.
         * REQUIRES: message parameter
         */
        dangerNotification: new signals.Signal()
    },

    characterManager: {
        changing: new signals.Signal(),
        changed: new signals.Signal()
    },

    /*****************************
     ****** In Game Events *******
     *****************************/

    events: {

        /**
         * Fired whenever a short rest is activated.
         */
        shortRest: new signals.Signal(),

        /**
         * Fired whenever a long rest is activated.
         */
        longRest: new signals.Signal()
    },

    /*****************************
     **** Data Changed Events ****
     *****************************/

    actionsToolbar: {
        toggle: new signals.Signal()
    },

    abilityScores: {
        changed: new signals.Signal(),
        intelligence: {
            changed: new signals.Signal(),
        },
        dexterity: {
            changed: new signals.Signal(),
        }
    },

    armor: {
        changed: new signals.Signal()
    },

    armorClass: {
        changed: new signals.Signal()
    },

    campaign: {
        changed: new signals.Signal()
    },

    characters: {
        changed: new signals.Signal(),
        allRemoved: new signals.Signal()
    },

    chat: {
        message: new signals.Signal(),
        iq: new signals.Signal(),
        presence: new signals.Signal(),
        room: new signals.Signal()
    },

    feat: {
        changed: new signals.Signal()
    },

    feature: {
        changed: new signals.Signal()
    },

    health: {
        changed: new signals.Signal(),
        maxHitPoints: {
            changed: new signals.Signal()
        },
        tempHitPoints: {
            changed: new signals.Signal()
        },
        damage: {
            changed: new signals.Signal()
        }
    },

    hitDice: {
        changed: new signals.Signal(),
    },

    hitDiceType: {
        changed: new signals.Signal(),
    },

    item: {
        changed: new signals.Signal()
    },

    magicItem: {
        changed: new signals.Signal()
    },

    encounters: {
        changed: new signals.Signal()
    },

    otherStats: {
        changed: new signals.Signal(),
        proficiency: {
            changed: new signals.Signal()
        }
    },

    playerImage: {
        changed: new signals.Signal()
    },

    playerInfo: {
        changed: new signals.Signal()
    },

    profile: {
        changed: new signals.Signal(),
        level: {
            changed: new signals.Signal()
        },
        experience: {
            changed: new signals.Signal()
        },
        characterName: {
            changed: new signals.Signal()
        },
        playerSummary: {
            changed: new signals.Signal()
        },
        playerType: {
            changed: new signals.Signal()
        },
        race: {
            changed: new signals.Signal()
        },
        playerClass: {
            changed: new signals.Signal()
        }
    },

    proficiency: {
        changed: new signals.Signal()
    },

    proficiencyBonus: {
        changed: new signals.Signal()
    },

    settings: {
        changed: new signals.Signal()
    },

    skills: {
        changed: new signals.Signal(),
        perception: {
            changed: new signals.Signal()
        }
    },

    spellSlots: {
        changed: new signals.Signal()
    },

    spellStats: {
        changed: new signals.Signal()
    },

    stats: {
        changed: new signals.Signal(),
        armorClassModifier: {
            changed: new signals.Signal()
        }
    },

    status: {
        changed: new signals.Signal(),
        healthiness: {
            changed: new signals.Signal()
        },
        magic: {
            changed: new signals.Signal()
        },
        tracked: {
            changed: new signals.Signal()
        }
    },

    trait: {
        changed: new signals.Signal()
    },

    tracked: {
        changed: new signals.Signal()
    },

    weapon: {
        changed: new signals.Signal()
    },

    treasure: {
        changed: new signals.Signal()
    },

    wizard: {
        /**
         * Dispatched when the Wizard has completed making a character.
         */
        completed: new signals.Signal()
    },

    /**
     * Messaging Notifications
     */

    xmpp: {
        connected: new signals.Signal(),
        disconnected: new signals.Signal(),

        routes: {
            chat: new signals.Signal(),
            pcard: new signals.Signal()
        },

        pubsub: {
            created: new signals.Signal(),
            subscribed: new signals.Signal(),
            unsubscribed: new signals.Signal()
        }
    }
};
