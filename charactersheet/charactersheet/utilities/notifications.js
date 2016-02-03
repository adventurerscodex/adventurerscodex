"use strict";

/**
 * A central repository of signals used in Adventurer's Codex
 * To be notified of changes to an outside module, subscribe to a 
 * given notification.
 */

var Notifications = {

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

    connectionManager: {
        connected: new signals.Signal(),
        disconnected: new signals.Signal(),
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

    characterManager: {
        changing: new signals.Signal(),
        changed: new signals.Signal() 
    },

    spellStats: {
	    changed: new signals.Signal()
    },

};
