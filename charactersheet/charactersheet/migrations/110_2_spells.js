'use strict';

/**
* Converts legacy spell values to current spell values.
*/
var migration_110_2_spells = {
    name: 'Spell Values Migration',
    version: '1.1.0',
    migration: function() {
        var spells = PersistenceService.findAllObjs('Spell');
        for (var i in spells) {
            var id = spells[i].id;
            var spell = spells[i].data;

            if (spell.spellType === 'Attack Roll') {
                spell.spellType = '';
            }
            if (spell.spellSchool === 'Cantrip') {
                spell.spellSchool = '';
            }
            if (spell.spellDuration === '1 min') {
                spell.spellDuration = '1 minute';
            }
            if (spell.spellDuration === '10 min') {
                spell.spellDuration = '10 minutes';
            }
            if (spell.spellDuration === 'Concentration, 1 min') {
                spell.spellDuration = 'Concentration, up to 1 minute';
            }
            if (spell.spellDuration === 'Concentration, 10 min') {
                spell.spellDuration = 'Concentration, up to 10 minutes';
            }
            if (spell.spellDuration === 'Concentration, 1 hour') {
                spell.spellDuration = 'Concentration, up to 1 hour';
            }
            if (spell.spellDuration === 'Concentration, 8 hours') {
                spell.spellDuration = 'Concentration, up to 8 hours';
            }
            if (spell.spellDuration === 'Concentration, 24 hours') {
                spell.spellDuration = 'Concentration, up to 24 hours';
            }
            if (spell.spellRange === '5 ft') {
                spell.spellRange = '5 feet';
            }
            if (spell.spellRange === '10 ft') {
                spell.spellRange = '10 feet';
            }
            if (spell.spellRange === '30 ft') {
                spell.spellRange = '30 feet';
            }
            if (spell.spellRange === '60 ft') {
                spell.spellRange = '60 feet';
            }
            if (spell.spellRange === '90 ft') {
                spell.spellRange = '90 feet';
            }
            if (spell.spellRange === '100 ft') {
                spell.spellRange = '100 feet';
            }
            if (spell.spellRange === '120 ft') {
                spell.spellRange = '120 feet';
            }
            if (spell.spellRange === '150 ft') {
                spell.spellRange = '150 feet';
            }
            if (spell.spellRange === '300 ft') {
                spell.spellRange = '300 feet';
            }
            if (spell.spellRange === '500 ft') {
                spell.spellRange = '500 feet';
            }
            PersistenceService.saveObj('Spell', id, spell);
        }
    }
};
