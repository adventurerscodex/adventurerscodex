'use strict';

describe('Wizard Profile ViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Init', function() {
        it('should hit init', function() {
            var wizard = new WizardProfileStepViewModel();
            var init = simple.mock(wizard, 'init').callFn(function(){});

            init.called.should.equal(false);

            wizard.init();

            init.called.should.equal(true);
        });
    });

    describe('Load', function() {
        it('should hit load', function() {
            var wizard = new WizardProfileStepViewModel();
            var load = simple.mock(wizard, 'load').callFn(function(){});

            load.called.should.equal(false);

            wizard.load();

            load.called.should.equal(true);
        });
    });

    describe('Unload', function() {
        it('should hit unload', function() {
            var wizard = new WizardProfileStepViewModel();
            var unload = simple.mock(wizard, 'unload').callFn(function(){});

            unload.called.should.equal(false);

            wizard.unload();

            unload.called.should.equal(true);
        });
    });

    describe('Prepopulate', function() {
        it('should populate race', function() {
            var wizard = new WizardProfileStepViewModel();

            wizard.setRace('label', 'Elf');

            wizard.race().should.equal('Elf');
        });

        it('should populate class', function() {
            var wizard = new WizardProfileStepViewModel();

            wizard.setClass('label', 'Wizard');

            wizard.typeClass().should.equal('Wizard');
        });
    });

    describe('Ready', function() {
        it('should determine if step is ready', function() {
            var wizard = new WizardProfileStepViewModel();

            var ready = wizard.ready();
            ready.should.equal(false);

            wizard.characterName('Bob');

            ready = wizard.ready();
            ready.should.equal(false);

            wizard.playerName('Bobby');

            ready = wizard.ready();
            ready.should.equal(true);
        });
    });
});
