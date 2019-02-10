import { Feat } from 'charactersheet/models/character/feat';
import { Feature } from 'charactersheet/models/character/feature';
import { Fixtures } from 'charactersheet/utilities/fixtures';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { Proficiency } from 'charactersheet/models/character/proficiency';
import { Tracked } from 'charactersheet/models/character/tracked';
import uuid from 'node-uuid';

/**
 * Migrates Feats, Features, Proficiencies, and Daily Features to new models.
 */
export var migration_130_2_feats_features_proficiencies_daily_features = {
    name: 'Feats, Features, Proficiencies, and Daily Features to new models migration',
    version: '1.3.0',
    migration: function() {
        var featsProfs = PersistenceService.findAllObjs('FeatsProf');
        var dailyFeatures = PersistenceService.findAllObjs('DailyFeature');

        featsProfs.forEach(function(element) {
            var characterId = element.data.characterId;
            var proficiency = element.data.proficiencies;
            var feats = element.data.feats;
            var features = element.data.specialAbilities;

            if (proficiency) {
                var newProficiency = {};
                newProficiency.coreUuid = characterId;
                newProficiency.name = 'Archived Proficiencies';
                newProficiency.description = proficiency;

                PersistenceService.saveObj('Proficiency', element.id, newProficiency);
            }

            if (feats) {
                var newFeat = {};
                newFeat.coreUuid = characterId;
                newFeat.name = 'Archived Feats';
                newFeat.description = feats;

                PersistenceService.saveObj('Feat', element.id, newFeat);
            }

            if (features) {
                var newFeature = {};
                newFeature.coreUuid = characterId;
                newFeature.name = 'Archived Features';
                newFeature.description = features;

                PersistenceService.saveObj('Feature', element.id, newFeature);
            }
            PersistenceService._delete('FeatsProf', element.id);
        });

        dailyFeatures.forEach(function(element) {
            var characterId = element.data.characterId;
            var trackedList = PersistenceService.findBy(Tracked, 'characterId', characterId);

            var feature = {};
            feature.name = element.data.featureName;
            feature.characterId = characterId;
            feature.description = element.data.featureDescription;
            feature.isTracked = true;
            feature.trackedId = uuid.v4();

            var tracked = {};
            tracked.maxUses = element.data.featureMaxUses;
            tracked.used = element.data.featureUsed;
            tracked.trackedId = feature.trackedId;
            tracked.characterId = characterId;
            tracked.resetsOn = element.data.featureResetsOn;
            tracked.type = Feature;
            tracked.color = Fixtures.general.colorList[trackedList.length
                % Fixtures.general.colorList.length];

            PersistenceService.saveObj('Feature', element.id, feature);
            PersistenceService.saveObj('Tracked', element.id, tracked);

            PersistenceService._delete('DailyFeature', element.id);
        });
    }
};
