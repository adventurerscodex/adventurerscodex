export var PlayerTypes = {
    characterPlayerType: {
        key: 'character',
        visibleTabs: [
            'profile', 'stats', 'skills', 'spells', 'equipment',
            'inventory', 'notes', 'settings', 'party', 'chat', 'exhibit'],
        defaultTab: 'stats'
    },
    dmPlayerType: {
        key: 'dm',
        visibleTabs: ['encounter', 'overview', 'dmscreen', 'party', 'chat', 'notes'],
        tabViewModels: [],
        defaultTab: 'overview'
    }
};
