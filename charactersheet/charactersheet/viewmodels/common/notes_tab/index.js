'use strict';

import ko from 'knockout'

import { NotesViewModel } from 'charactersheet/viewmodels/common'
import { ViewModelUtilities } from 'charactersheet/utilities'

/**
 * This view model contains the player's notes information.
 */
export function NotesTabViewModel() {
    var self = this;

    self.notesViewModel = ko.observable(new NotesViewModel());

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
