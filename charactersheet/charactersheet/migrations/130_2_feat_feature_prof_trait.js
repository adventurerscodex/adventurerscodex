'use strict';

/**
* Migrates legacy models to new models for Feats, Features, Proficiencies, and Daily Features.
*/
var migration_130_1_armors = {
    name: 'Feats, Features, Proficiencies, and Daily Features migration',
    version: '1.3.0',
    migration: function() {
        var armors = PersistenceService.findAllObjs('FeatsProf');
        var armors = PersistenceService.findAllObjs('DailyFeature');
        armors.forEach(function(armor, idx, _) {
            var id = armors[idx].id;
            var armor = armors[idx].data;

            if (armor.armorType.toLowerCase().trim() === 'shields') {
                armor.armorType = 'Shield';
            }

            PersistenceService.saveObj('Armor', id, armor);
        });
    }
};
