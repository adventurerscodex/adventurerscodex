import ko from 'knockout';

/**
 * Returns a player character with the key '1234'.
 */
let MockCharacterManager = {};

MockCharacterManager.activeCharacter = function() {
    return {
        key: ko.observable('12345'),
        playerType: ko.observable({
            key: 'character',
            visibleTabs: [
                'profile', 'stats', 'skills', 'spells', 'equipment',
                'inventory', 'notes', 'settings', 'party', 'chat', 'exhibit'],
            rootViewModel: null,
            defaultTab: 'stats'
        })
    };
};

export { MockCharacterManager };
