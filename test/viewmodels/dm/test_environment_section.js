import {
    CharacterManager,
    Notifications
} from 'charactersheet/utilities';
import { Encounter } from 'charactersheet/models/dm/encounter';
import { EnvironmentSection } from 'charactersheet/models/dm';
import { EnvironmentSectionViewModel } from 'charactersheet/viewmodels/dm';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import Should from 'should';
import simple from 'simple-mock';

describe('EnvironmentSectionViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Load', function() {
        it('should load model and section', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new EnvironmentSectionViewModel(new Encounter());
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.encounters.changed, 'add');
            simple.mock(PersistenceService, 'findFirstBy').callFn(function(model, property, value) {
                if (model.name === 'EnvironmentSection') {
                    return new EnvironmentSection();
                } else if (model.name === 'Environment') {
                    var environment = new Environment();
                    environment.imageUrl('link');
                    return environment;
                }
            });

            vm.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });
        it('should load model and section', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new EnvironmentSectionViewModel(new Encounter());
            var spy1 = simple.mock(Notifications.global.save, 'add');
            var spy2 = simple.mock(Notifications.encounters.changed, 'add');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);

            vm.load();

            spy1.called.should.equal(true);
            spy2.called.should.equal(true);
        });
    });

    describe('Save', function() {
        it('should save model', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.weather('Rainy');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Environment());

            vm.save();
        });
        it('should create and save a new model', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.weather('Rainy');
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);

            vm.save();
        });
    });

    describe('Delete', function() {
        it('should delete model', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(new Environment());

            vm.delete();
        });
        it('should do nothing since it can\'t find the model', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);

            vm.delete();
        });
    });

    /* UI Methods */

    describe('Weather label', function() {
        it('should return the weather', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.weather('Rainy');
            var label = vm.weatherLabel();

            label.should.equal('Rainy');
        });
        it('should return unknown', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            var label = vm.weatherLabel();

            label.should.equal('Unknown');
        });
    });

    describe('Terrain label', function() {
        it('should return the terrain', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.terrain('Rocky');
            var label = vm.terrainLabel();

            label.should.equal('Rocky');
        });
        it('should return unknown', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            var label = vm.terrainLabel();

            label.should.equal('Unknown');
        });
    });

    describe('Show dividing marker', function() {
        it('should return true', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.imageUrl('link');
            var label = vm.shouldShowDividingMarker();

            label.should.equal('link');
        });
        it('should return true', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.description('desc');
            var label = vm.shouldShowDividingMarker();

            label.should.equal('desc');
        });
        it('should return true', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.imageUrl('link');
            vm.description('desc');
            var label = vm.shouldShowDividingMarker();

            label.should.equal('link');
        });
        it('should return false', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            var label = vm.shouldShowDividingMarker();

            label.should.equal('');
        });
    });

    describe('selectPreviewTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());

            vm.previewTabStatus('');
            vm.editTabStatus('active');
            vm.selectPreviewTab();
            vm.previewTabStatus().should.equal('active');
            vm.editTabStatus().should.equal('');
        });
    });

    describe('selectEditTab', function() {
        it('perform actions after the preview tab has been selected', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());

            vm.previewTabStatus('active');
            vm.editTabStatus('');
            vm.selectEditTab();
            vm.previewTabStatus().should.equal('');
            vm.editTabStatus().should.equal('active');
        });
    });

    describe('Show determine image width', function() {
        it('should return nothing', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.imageUrl('link');
            var label = vm.imageWidth();

            label.should.equal('');
        });
        it('should return 50%', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.description('desc');
            vm.imageUrl('link');
            var label = vm.imageWidth();

            label.should.equal('50%');
        });
    });

    describe('Show determine image class', function() {
        it('should return base class', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.imageUrl('link');
            var label = vm.imageClass();

            label.should.equal('embedded-image');
        });
        it('should base class pulled right', function() {
            var vm = new EnvironmentSectionViewModel(new Encounter());
            vm.description('desc');
            vm.imageUrl('link');
            var label = vm.imageClass();

            label.should.equal('embedded-image pull-right');
        });
    });

    describe('Data has changed', function() {
        it('should load new data', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new EnvironmentSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').returnWith(null);

            vm._dataHasChanged();
        });
        it('should load new data', function() {
            simple.mock(CharacterManager, 'activeCharacter').callFn(MockCharacterManager.activeCharacter);
            var vm = new EnvironmentSectionViewModel(new Encounter());
            simple.mock(PersistenceService, 'findFirstBy').callFn(function(model, property, value) {
                if (model.name === 'EnvironmentSection') {
                    return new EnvironmentSection();
                } else if (model.name === 'Environment') {
                    var environment = new Environment();
                    environment.imageUrl('link');
                    return environment;
                }
            });

            vm._dataHasChanged();
        });
    });
});
