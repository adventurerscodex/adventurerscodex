import ko from 'knockout'

import { PartyViewModel } from 'charactersheet/viewmodels/dm'
import { ViewModelUtilities } from 'charactersheet/utilities'

export function PartyTabViewModel() {
    var self = this;

    self.partyViewModel = ko.observable(new PartyViewModel());

    self.load = function() {
        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
    };
}
