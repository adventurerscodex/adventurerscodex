import {
    BackpacksRepositoryFixture,
    ItemsRepositoryFixture
} from '../fixtures';
import { DataRepository } from 'charactersheet/utilities';
import { WizardProfileStepViewModel } from 'charactersheet/viewmodels/common/wizard/steps';
import simple from 'simple-mock';
import should from 'Should';
import ko from 'knockout';

describe('Wizard Profile ViewModel', function(){
    //Clean up after each test.
    afterEach(function() {
        simple.restore();
    });

    describe('Init', function() {
        it('should hit init', function() {
            var wizard = new WizardProfileStepViewModel({});
            var init = simple.mock(wizard, 'init').callFn(function(){});

            init.called.should.equal(false);

            wizard.init();

            init.called.should.equal(true);
        });
    });

    describe('Load', function() {
        it('should hit load', function() {
            var wizard = new WizardProfileStepViewModel({});
            var load = simple.mock(wizard, 'load').callFn(function(){});

            load.called.should.equal(false);

            wizard.load();

            load.called.should.equal(true);
        });
    });

    describe('Prepopulate', function() {
        it('should populate race', function() {
            var wizard = new WizardProfileStepViewModel({});

            wizard.setRace('label', 'Elf');

            wizard.race().should.equal('Elf');
        });

        it('should populate class', function() {
            var wizard = new WizardProfileStepViewModel({});

            wizard.setClass('label', 'Wizard');

            wizard.typeClass().should.equal('Wizard');
        });
    });

    describe('Populate Traits from Race', function() {
        var wizard = new WizardProfileStepViewModel({});
        wizard.setRace('label', 'Elf');

        wizard.race().should.equal('Elf');

        simple.mock(DataRepository, 'traits',
            {'Age (Elf)': {
                'description': 'You are old.',
                'name': 'Age',
                'race': 'Elf'
            }
        }
        );
        var traits = wizard.populateTraits();
        traits.length.should.equal(1);
        traits[0].name.should.equal('Age');
    });

    describe('Populate Backpack Items', function() {
        var wizard = new WizardProfileStepViewModel({});
        wizard.setBackpack('label', 'Burglar\'s Pack');

        wizard.backpack().should.equal('Burglar\'s Pack');

        simple.mock(DataRepository, 'items', ItemsRepositoryFixture);
        simple.mock(DataRepository, 'backpacks', BackpacksRepositoryFixture);

        var items = wizard.populateBackpackItems();
        items.length.should.equal(1);
        items[0].itemName.should.equal('Backpack');
        items[0].itemQty.should.equal(5);
    });
});
