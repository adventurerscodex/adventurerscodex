'use strict';

var PlayerTypes = {
    characterPlayerType: {
        key: 'character',
        visibleTabs: [
            'profile', 'stats', 'skills', 'spells', 'equipment',
            'inventory', 'notes', 'settings', 'party', 'chat'],
        rootViewModel: CharacterRootViewModel,
        defaultTab: 'stats'
    },
    dmPlayerType: {
        key: 'dm',
        visibleTabs: ['encounter', 'overview', 'dmscreen', 'party', 'chat', 'notes'],
        tabViewModels: [],
        rootViewModel: DMRootViewModel,
        defaultTab: 'overview'
    }
};
