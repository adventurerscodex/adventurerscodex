"use strict";

var SettingsSignaler = {
    changed: new signals.Signal()
};

function SettingsViewModel() {
    var self = this;
    
    self.playerInfoViewModel = ko.observable(new PlayerInfoViewModel());

	self.init = function() {
    	var keys = Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().init();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to init.\n" + err;
    			}
    		}
    	}
	};
	
	self.load = function() {
    	var keys = Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().load();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to load.\n" + err;
    			}
    		}
    	}
	};

    self.unload = function() {
    	var keys =  Object.keys(self);
    	for (var i in keys) {
    		if (keys[i].indexOf('ViewModel') > -1) {
    			try {
	    			self[keys[i]]().unload();
    			} catch(err) {
    				throw "Module " + keys[i] + " failed to unload.\n" + err;
    			}
    		}
    	}
    };
};
