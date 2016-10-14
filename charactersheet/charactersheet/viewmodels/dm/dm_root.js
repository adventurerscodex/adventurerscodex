'use strict';

function DMRootViewModel() {
    var self = this;

    self.playerType = function() {
        return CharacterManager.activeCharacter().playerType();
    };
    self._dummy = ko.observable(false);
    self.activeTab = ko.observable();
    self.TEMPLATE_FILE = 'dm/index.tmpl';

    //Player Child View Models
    // TODO: Add

    //Tooltips
    // TODO: Add

    //Tab Properties
    // TODO: Add

    //UI Methods

    self.playerSummary = ko.pureComputed(function() {
        return 'Nothing here';
    });

    self.playerTitle = ko.pureComputed(function() {
        return 'Nothing here';
    });

    self.playerAuthor = ko.pureComputed(function() {
        return 'Nothing here';
    });

    self.pageTitle = ko.pureComputed(function() {
        self._dummy();
        try {
            return self.playerTitle() + ' by ' + self.playerAuthor()
                + ' | Adventurer\'s Codex';
        } catch(err) { /*Ignore*/ }
    });

    //Public Methods

    /**
     * Call Init on each sub-module.
     */
    self.init = function() {
        ViewModelUtilities.initSubViewModels(self);
    };

    /**
     * Signal all modules to load their data.
     */
    self.load = function() {
        self.activeTab(self.playerType().defaultTab);

        ViewModelUtilities.loadSubViewModels(self);
    };

    self.unload = function() {
        ViewModelUtilities.unloadSubViewModels(self);
    };

    //Private Methods

    self._tabIsVisible = function(tabName) {
        if (self.playerType().visibleTabs.indexOf(tabName) > -1) {
            return self.activeTab() === tabName ? 'active' : '';
        } else {
            return 'hidden';
        }
    };
}
