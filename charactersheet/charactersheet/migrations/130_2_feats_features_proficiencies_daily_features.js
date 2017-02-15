'use strict';

/**
* Migrates Feats, Features, Proficiencies, and Daily Features to new models.
*/
var migration_130_2_feats_features_proficiencies_daily_features = {
    name: 'Feats, Features, Proficiencies, and Daily Features to new models migration',
    version: '1.3.0',
    migration: function() {
        var featsProfs = PersistenceService.findAllObjs('FeatsProf');
        var dailyFeatures = PersistenceService.findAllObjs('DailyFeature');

        featsProfs.forEach(function(element, idx, _) {
            var characterId = element.characterId();
            var proficiency = element.proficiencies();
            var feats = element.feats();
            var features = element.specialAbilities();

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
        });

        dailyFeatures.forEach(function(element, idx, _) {
            var characterId = element.characterId();
            var trackedList = PersistenceService.findBy(Tracked, 'characterId', characterId);

            var feature = new Feature();
            feature.name(element.featureName());
            feature.characterId(characterId);
            feature.description(element.description());
            feature.isTracked(true);
            feature.trackedId(uuid.v4());

            var tracked = new Tracked();
            tracked.maxUses(element.featureMaxUses());
            tracked.used(element.featureUsed());
            tracked.trackedId(feature.trackedId());
            tracked.characterId(characterId);
            tracked.resetsOn(element.featureResetsOn());
            tracked.type(Feature);
            tracked.color(Fixtures.general.colorList[trackedList.length
                % Fixtures.general.colorList.length])

            feature.save();
            tracked.save();
        });
    }
};
