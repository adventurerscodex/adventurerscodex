import ko from 'knockout'

import { EncounterViewModel } from 'charactersheet/viewmodels/dm'
import { ViewModelUtilities } from 'charactersheet/utilities'

export function EncounterTabViewModel() {
    var self = this;

    self.encounterViewModel = ko.observable(new EncounterViewModel());

    //Public Methods

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
    };
}
