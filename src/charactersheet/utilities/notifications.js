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

    abilityScores: {
        changed: new Signal(),
        strength: {
            changed: new Signal()
        },
        dexterity: {
            changed: new Signal()
        },
        constitution: {
            changed: new Signal()
        },
        intelligence: {
            changed: new Signal()
        },
        wisdom: {
            changed: new Signal()
        },
        charisma: {
            changed: new Signal()
        }
    },

    armor: {
        changed: new Signal()
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

    exhibit: {
        changed: new Signal()
    },

    feat: {
        changed: new Signal(),
        tracked: {
            changed: new Signal()
        }
    },

    feature: {
        changed: new Signal(),
        tracked: {
            changed: new Signal()
        }
    },

    health: {
        changed: new Signal(),
        maxHitPoints: {
            changed: new Signal()
        },
        tempHitPoints: {
            changed: new Signal()
        },
        damage: {
            changed: new Signal()
        }
    },

    hitDice: {
        changed: new Signal()
    },

    hitDiceType: {
        changed: new Signal()
    },

    item: {
        changed: new Signal()
    },

    magicItem: {
        changed: new Signal()
    },

    notes: {
        changed: new Signal()
    },

    encounters: {
        changed: new Signal()
    },

    otherStats: {
        changed: new Signal(),
        proficiency: {
            changed: new Signal()
        },
        inspiration: {
            changed: new Signal()
        }
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
        level: {
            changed: new Signal()
        },
        experience: {
            changed: new Signal()
        },
        characterName: {
            changed: new Signal()
        },
        playerName: {
            changed: new Signal()
        },
        playerSummary: {
            changed: new Signal()
        },
        playerType: {
            changed: new Signal()
        },
        race: {
            changed: new Signal()
        },
        playerClass: {
            changed: new Signal()
        }
    },

    proficiency: {
        changed: new Signal()
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

    skills: {
        changed: new Signal(),
        perception: {
            changed: new Signal()
        }
    },

    spellSlots: {
        changed: new Signal()
    },

    spellStats: {
        changed: new Signal()
    },

    stats: {
        changed: new Signal(),
        armorClassModifier: {
            changed: new Signal()
        },
        deathSaves: {
            fail: {
                changed: new Signal()
            },
            success: {
                changed: new Signal()
            },
            notFail: {
                changed: new Signal()
            },
            notSuccess: {
                changed: new Signal()
            }
        }
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
        changed: new Signal(),
        tracked: {
            changed: new Signal()
        }
    },

    tracked: {
        changed: new Signal(),
        feat: {
            changed: new Signal()
        },
        feature: {
            changed: new Signal()
        },
        trait: {
            changed: new Signal()
        }
    },

    weapon: {
        changed: new Signal()
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
