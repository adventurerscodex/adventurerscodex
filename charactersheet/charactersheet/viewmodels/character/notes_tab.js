'use strict';

/**
 * This view model contains the player's notes information.
 */
function NotesTabViewModel() {
    var self = this;

    self.notesViewModel = ko.observable(new NotesViewModel());

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
}
