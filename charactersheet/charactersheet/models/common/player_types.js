'use strict';

var PlayerTypes = {
    characterPlayerType: {
        key: 'character',
        visibleTabs: [
            'profile', 'stats', 'skills', 'spells', 'equipment',
            'inventory', 'notes', 'settings', 'party'],
        tabViewModels: [
            ProfileTabViewModel, StatsTabViewModel, SkillsTabViewModel,
            SpellsTabViewModel, EquipmentTabViewModel, InventoryTabViewModel,
            NotesTabViewModel
        ],
        rootViewModel: CharacterRootViewModel,
        defaultTab: 'stats'
    }
};
