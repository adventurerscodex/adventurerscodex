'use strict';

import ko from 'knockout'

import { CharacterManager } from 'charactersheet/utilities'
import { Notifications } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common'
import { ViewModelUtilities } from 'charactersheet/utilities'

export function ChatTabViewModel() {
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
