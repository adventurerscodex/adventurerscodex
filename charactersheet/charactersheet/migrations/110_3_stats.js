'use strict';

/**
* Sets proficiency to 0. This attribute is now considered a modifer and should
* be zero after the migration
*/
var migration_110_3_stats = {
    name: 'Stats Proficiency Values Migration',
    version: '1.1.0',
    migration: function() {
        var stats = PersistenceService.findAllObjs('OtherStats');
        for (var i in stats) {
            var id = stats[i].id;
            var stat = stats[i].data;

            stat.proficiency = 0;

            PersistenceService.saveObj('OtherStats', id, stat);
        }
    }
};