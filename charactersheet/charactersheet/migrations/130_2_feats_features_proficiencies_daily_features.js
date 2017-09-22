import {
    Feature,
    Feat,
    Proficiency,
    Tracked
} from 'charactersheet/models'

import { Fixtures } from 'charactersheet/utilities'
import { PersistenceService } from 'charactersheet/services/common/persistence_service.js'
import uuid from 'node-uuid'

/**
 * Migrates Feats, Features, Proficiencies, and Daily Features to new models.
 */
export var migration_130_2_feats_features_proficiencies_daily_features = {
    name: 'Feats, Features, Proficiencies, and Daily Features to new models migration',
    version: '1.3.0',
    migration: function() {
        var featsProfs = PersistenceService.findAllObjs('FeatsProf');
        var dailyFeatures = PersistenceService.findAllObjs('DailyFeature');

        featsProfs.forEach(function(element, idx, _) {
            var characterId = element.data.characterId;
            var proficiency = element.data.proficiencies;
            var feats = element.data.feats;
            var features = element.data.specialAbilities;

            if (proficiency) {
                var newProficiency = new Proficiency();
                newProficiency.characterId(characterId);
                newProficiency.name('Archived Proficiencies');
                newProficiency.description(proficiency);

                newProficiency.save();
            }

            if (feats) {
                var newFeat = new Feat();
                newFeat.characterId(characterId);
                newFeat.name('Archived Feats');
                newFeat.description(feats);

                newFeat.save();
            }

            if (features) {
                var newFeature = new Feature();
                newFeature.characterId(characterId);
                newFeature.name('Archived Features');
                newFeature.description(features);

                newFeature.save();
            }
            PersistenceService._delete('FeatsProf', element.id);
        });

        dailyFeatures.forEach(function(element, idx, _) {
            var characterId = element.data.characterId;
            var trackedList = PersistenceService.findBy(Tracked, 'characterId', characterId);

            var feature = new Feature();
            feature.name(element.data.featureName);
            feature.characterId(characterId);
            feature.description(element.data.featureDescription);
            feature.isTracked(true);
            feature.trackedId(uuid.v4());

            var tracked = new Tracked();
            tracked.maxUses(element.data.featureMaxUses);
            tracked.used(element.data.featureUsed);
            tracked.trackedId(feature.trackedId());
            tracked.characterId(characterId);
            tracked.resetsOn(element.data.featureResetsOn);
            tracked.type(Feature);
            tracked.color(Fixtures.general.colorList[trackedList.length
                % Fixtures.general.colorList.length]);

            feature.save();
            tracked.save();

            PersistenceService._delete('DailyFeature', element.id);
        });
    }
};
