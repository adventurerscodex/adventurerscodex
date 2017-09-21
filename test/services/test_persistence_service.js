/*eslint no-console:0*/

import simple from 'simple-mock';

import { mock_110_migration,
    mock_110_migration_fail,
    mock_134_migration,
    MockLocalStorage } from '../fixtures';
import { PersistenceService } from 'charactersheet/services/common';
import { Skill } from 'charactersheet/models/character/skill';

describe('Persistence Service', function() {
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Static Methods', function() {

        // Find All

        describe('Find All Objs', function() {
            it('should return a list of raw data objects from it\'s data store.', function() {
                simple.mock(PersistenceService, 'storage', MockLocalStorage);
                var count = Object.keys(JSON.parse(MockLocalStorage.Skill)).length;
                var objs = PersistenceService.findAllObjs('Skill');
                objs.length.should.equal(count);
            });
        });
        describe('Find All', function() {
            it('should return a list of mapped model objects from it\'s data store.', function() {
                simple.mock(PersistenceService, 'storage', MockLocalStorage);
                var count = Object.keys(JSON.parse(MockLocalStorage.Skill)).length;
                var objs = PersistenceService.findAll(Skill);
                objs.length.should.equal(count);
            });
        });

        // Save

        describe('Save', function() {
            it('should save a mapped model object to the data store', function() {
                var _saveObjStub = simple.mock(PersistenceService, '_save');
                _saveObjStub.called.should.equal(false);
                PersistenceService.save(Skill, new Skill());
                _saveObjStub.called.should.equal(true);
            });
        });
        describe('Save Obj', function() {
            it('should save a mapped model object to the data store', function() {
                var _saveObjStub = simple.mock(PersistenceService, '_saveObj').callFn(function() {});
                _saveObjStub.called.should.equal(false);
                PersistenceService.saveObj('Skill', 1, new Skill());
                _saveObjStub.called.should.equal(true);
            });
        });

        // Migrations

        describe('Migrate', function() {
            it('should check if a given set migrations should be applied, do so, and catch errors', function() {
                var applyMigrateStub = simple.mock(PersistenceService, '_applyMigration').callFn(function() {});
                var shouldApplyMigrateStub = simple.mock(PersistenceService, '_shouldApplyMigration').returnWith(true);
                var setVersion = simple.mock(PersistenceService, '_setVersion').callFn(function() {});

                PersistenceService.migrate([mock_110_migration], '1.1.0');

                applyMigrateStub.called.should.equal(true);
                shouldApplyMigrateStub.called.should.equal(true);
                setVersion.called.should.equal(true);
            });
            it('should check if a given set migrations should be applied, do so, and catch errors', function() {
                var applyMigrateStub = simple.mock(PersistenceService, '_applyMigration').callFn(function() {});
                var shouldApplyMigrateStub = simple.mock(PersistenceService, '_shouldApplyMigration').returnWith(true);
                var setVersion = simple.mock(PersistenceService, '_setVersion').callFn(function() {});
                //Migrations should not be applied.
                simple.mock(PersistenceService, 'getVersion').returnWith('1.1.0');

                PersistenceService.migrate([mock_110_migration], '1.1.0');

                applyMigrateStub.called.should.equal(false);
                shouldApplyMigrateStub.called.should.equal(false);
                setVersion.called.should.equal(false);
            });
        });

        describe('Should Apply Migration', function() {
            it('should determine if a migration should be applied. (true)', function() {
                var result = PersistenceService._shouldApplyMigration('1.1.0', undefined, mock_110_migration);
                result.should.equal(true);
            });
            it('should determine if an unmet migration should be applied. (false)', function() {
                var result = PersistenceService._shouldApplyMigration('0.1.0', undefined, mock_110_migration);
                result.should.equal(false);
            });
            it('should determine if an old migration should be applied. (false)', function() {
                var result = PersistenceService._shouldApplyMigration('1.1.3', '1.1.1', mock_110_migration);
                result.should.equal(false);
            });
            it('should determine if migrations should be applied if there\'s no change in version. (false)', function() {
                var result = PersistenceService._shouldApplyMigration('1.1.1', '1.1.1', mock_110_migration);
                result.should.equal(false);
            });
            it('should determine if migrations should be applied if the prev version is incomplete. (true)', function() {
                var result = PersistenceService._shouldApplyMigration('1.3.5', '1.3', mock_134_migration);
                result.should.equal(true);
            });
        });

        describe('Copy Using Keys', function() {
            it('should copy the values of an object\'s keys', function() {
                var copy = {};
                PersistenceService._copyObjectUsingKeys(MockLocalStorage, copy);
                JSON.stringify(copy).should.equal(JSON.stringify(MockLocalStorage));
            });
        });

        describe('Apply Migrations', function() {
//            it('should apply a given migration and catch errors', function() {
//                 var result = PersistenceService._applyMigration(mock_110_migration);
//                 PersistenceService.findAllObjs('Skill').forEach(function(e, i, _) {
//                     e.data.name.should.equal('Test');
//                 });
//             });
            it('should apply a given migration and catch errors', function() {
                PersistenceService.storage.Skill = MockLocalStorage.Skill;
                try {
                    var result = PersistenceService._applyMigration(mock_110_migration_fail);
                } catch(err) {
                    //Check rollback
                    PersistenceService.findAllObjs('Skill').forEach(function(e, i, _) {
                        e.data.name.should.not.equal('Test');
                    });
                    return;
                }
                Should.fail(); // Auto fail.
            });
        });
    });
});
