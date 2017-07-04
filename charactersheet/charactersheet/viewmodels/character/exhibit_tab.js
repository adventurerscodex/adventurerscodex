'use strict';

/**
 * This view model contains the player's Exhibit.
 */
function ExhibitTabViewModel() {
    var self = this;

    self.exhibitViewModel = ko.observable(new ExhibitViewModel());

    self.load = function() {
        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
    };

    self.clear = function() {
        ViewModelUtilities.clearSubViewModels(self);
    };
}