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

    status: {
        changed: new signals.Signal()
    },

    abilityScores: {
        changed: new signals.Signal()
    },

    armor: {
        changed: new signals.Signal()
    },

    campaign: {
        changed: new signals.Signal()
    },

    characters: {
        changed: new signals.Signal(),
        allRemoved: new signals.Signal()
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

    playerImage: {
        changed: new signals.Signal()
    },

    playerInfo: {
        changed: new signals.Signal()
    },

    profile: {
        changed: new signals.Signal()
    },

    settings: {
        changed: new signals.Signal()
    },

    stats: {
        changed: new signals.Signal()
    },

    skills: {
        changed: new signals.Signal()
    },

    spellStats: {
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
    }
};
