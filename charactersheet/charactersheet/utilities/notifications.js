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
     ** Messenger Service Events *
     *****************************/

    connectionManager: {
        connected: new signals.Signal(),
        disconnected: new signals.Signal(),
        changed: new signals.Signal()
    },

    connectedPlayers: {
        /**
         * Called when a new player connects to the room
         * @param Player model representing new player.
         */
        playerEntered: new signals.Signal(),

        /**
         * Called when a new player leaves the room
         * @param Player model representing the exiting player.
         */
        playerLeft: new signals.Signal()
    },

    playerSummary: {
        /**
         * Called when the list of player summaries has been updated.
         */
        changed: new signals.Signal()
    },

    /*****************************
     **** Data Changed Events ****
     *****************************/

    abilityScores: {
        changed: new signals.Signal()
    },

    campaign: {
        changed: new signals.Signal()
    },

    characters: {
        changed: new signals.Signal(),
        allRemoved: new signals.Signal()
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
    }
};
