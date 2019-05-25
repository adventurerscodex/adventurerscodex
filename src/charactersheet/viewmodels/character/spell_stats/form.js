import {
  CoreManager,
  DataRepository,
  Fixtures,
  Notifications
} from 'charactersheet/utilities';

import { FormBaseController } from 'charactersheet/components/form-base-controller';
import { SpellStats } from 'charactersheet/models';

import ko from 'knockout';
import template from './form.html';

export class SpellStatsFormViewModel  extends FormBaseController {
    generateBlank() {
        return new SpellStats();
    }

    async refresh() {
        const key = CoreManager.activeCore().uuid();
        const stats = await SpellStats.ps.read({uuid: key});
        this.entity().importValues(stats.object.exportValues());
    }

    setSpellCastingAbility = (label, value) => {
        this.entity().castingAbility(label);
    };
    
    // // Pre-pop methods
    // proficienciesPrePopFilter = (request, response) => {
    //     const term = request.term.toLowerCase();
    //     let results = [];
    //     if (term && term.length > 2) {
    //         const keys = DataRepository.proficiencies
    //             ? Object.keys(DataRepository.proficiencies)
    //             : [];
    //         results = keys.filter(function(name, idx, _) {
    //             return name.toLowerCase().indexOf(term) > -1;
    //         });
    //     }
    //     response(results);
    // };
    //
    // populateProficiency = (label, value) => {
    //     const proficiency = DataRepository.proficiencies[label];
    //     this.entity().importValues(proficiency);
    //     this.showDisclaimer(true);
    // };
    //
    // setType = (label, value) => {
    //     this.entity().type(value);
    // };

    notify() { Notifications.spellStats.changed.dispatch(); }

    validation = {
        // submitHandler: (form, event) => {
        //     event.preventDefault();
        //     self.addFeature();
        // },
        // updateHandler: ($element) => {
        //     self.addFormIsValid($element.valid());
        // },
        // Deep copy of properties in object
        ...SpellStats.validationConstraints
    };
}

ko.components.register('spell-stats-form', {
    viewModel: SpellStatsFormViewModel,
    template: template
});
