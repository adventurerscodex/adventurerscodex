export var PlayerTypes = {
    character: {
        visibleTabs: [
            'profile', 'stats', 'skills', 'spells', 'equipment',
            'inventory', 'notes', 'settings', 'party', 'chat', 'exhibit'],
        defaultTab: 'stats'
    },
    dm: {
        visibleTabs: ['encounter', 'overview', 'dmscreen', 'party', 'chat', 'notes'],
        tabViewModels: [],
        defaultTab: 'overview'
    }
};
