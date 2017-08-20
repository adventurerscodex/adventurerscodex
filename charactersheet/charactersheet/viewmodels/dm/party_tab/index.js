'use strict';


function PartyTabViewModel() {
    var self = this;

    self.partyViewModel = ko.observable(new PartyViewModel());

    self.load = function() {
        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
    };
}
