'use strict';

function ChatTabViewModel() {
    var self = this;

    self.chatViewModel = ko.observable(new ChatViewModel());

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
