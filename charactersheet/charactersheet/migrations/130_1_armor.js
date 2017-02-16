'use strict';

/**
* Changes Armor property from 'Shields' to 'Shield'.
*/
var migration_130_1_armors = {
    name: 'Armor type migration',
    version: '1.3.0',
    migration: function() {
        var armors = PersistenceService.findAllObjs('Armor');
        armors.forEach(function(element, idx, _) {
            var id = armors[idx].id;
            var armor = armors[idx].data;

            if (armor.armorType.toLowerCase().trim() === 'shields') {
                armor.armorType = 'Shield';
            }

            PersistenceService.saveObj('Armor', id, armor);
        });
    }
};
