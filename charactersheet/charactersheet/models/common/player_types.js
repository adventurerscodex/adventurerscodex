'use strict';

var PlayerTypes = {
    characterPlayerType: {
        key: 'character',
        visibleTabs: [
            'profile', 'stats', 'skills', 'spells', 'equipment',
            'inventory', 'notes', 'settings', 'party'],
        rootViewModel: CharacterRootViewModel,
        defaultTab: 'stats'
    },
    dmPlayerType: {
        key: 'dm',
        visibleTabs: ['encounter', 'overview'],
        tabViewModels: [],
        rootViewModel: DMRootViewModel,
        defaultTab: 'overview'
    }
};
