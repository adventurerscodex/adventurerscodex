'use strict';

var Migrations = {
    // List all migrations that should be applied
    scripts : [
        // v1.1
        migration_110_1_skills,
        migration_110_2_spells,
        migration_110_3_stats,
        // v1.2
        migration_120_1_weapons,
        // v1.3
        migration_130_1_armors,
        migration_130_2_feats_features_proficiencies_daily_features,
        // v1.5
        migration_150_1_dm_notes
    ]
};
