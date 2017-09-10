/*eslint no-console:0 */

import simple from 'simple-mock'

import { PersistenceService } from 'charactersheet/services/common'

describe('130 Features, Feats, and Traits Migration', function() {
    describe('Migration', function() {
        it('Migrates all Features Feats and Traits to an archived object in the new style.', function() {
            var findAll = simple.mock(PersistenceService, 'findAllObjs').callFn(function(name) {
                if (name == 'FeatsProf') {
                    return featureFeatsTraitsFixture;
                } else {
                    return dailyFeaturesFixture;
                }
            });
            var deleteObjs = simple.mock(PersistenceService, '_delete').callFn(function() {});
            var saveObj = simple.mock(PersistenceService, 'register').callFn(function(model, inst) {
                return new function() {
                    this.save = function() {
                        if (model.name == 'Feature') {
                            var dailyFeatureIds = dailyFeaturesFixture.map(function(e, i, _) { return e.data.characterId; });
                            var dailyFeatureNames = dailyFeaturesFixture.map(function(e, i, _) { return e.data.featureName; });

                            var isDailyFeatureExample = dailyFeatureIds.indexOf(inst.characterId()) > -1;
                            if (isDailyFeatureExample) {
                                inst.name().should.equal(dailyFeatureNames[0]);
                            } else {
                                inst.description().should.equal(featureFeatsTraitsFixture[0].data.specialAbilities);
                            }
                        } else if (model.name == 'Feat') {
                            inst.description().should.equal(featureFeatsTraitsFixture[0].data.feats);
                        } else if (model.name == 'Proficiency'){
                            inst.description().should.equal(featureFeatsTraitsFixture[0].data.proficiencies);
                        } else if (model.name == 'Tracked') {
                            inst.maxUses().should.equal(dailyFeaturesFixture[0].data.featureMaxUses);
                        } else {
                            throw 'UNHANDLED CASE';
                        }
                    };
                };
            });

            migration_130_2_feats_features_proficiencies_daily_features.migration();
            saveObj.callCount.should.equal(5);
            deleteObjs.callCount.should.equal(2);
            findAll.callCount.should.equal(2);
        });
    });
});
