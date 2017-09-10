import ko from 'knockout'

import { ExhibitViewModel } from 'charactersheet/viewmodels/character/exhibit'
import { ViewModelUtilities } from 'charactersheet/utilities'

/**
 * This view model contains the player's Exhibit.
 */
export function ExhibitTabViewModel() {
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