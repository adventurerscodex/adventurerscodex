'use strict';

function EnemiesTabViewModel() {
    var self = this;

    self.enemiesViewModel = ko.observable(new EnemiesViewModel());

    self.init = function() {
        ViewModelUtilities.initSubViewModels(self);
    };

    self.load = function() {
        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
    };

    self.clear = function() {
        ViewModelUtilities.clearSubViewModels(self);
    };
};

