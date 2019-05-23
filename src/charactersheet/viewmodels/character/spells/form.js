import {
  CoreManager,
  DataRepository,
  Fixtures,
  Notifications
} from 'charactersheet/utilities';

import { FormController } from 'charactersheet/components/form-controller-component';
import { Spell } from 'charactersheet/models';

import { debounce } from 'lodash';
import ko from 'knockout';
import template from './form.html';


export class SpellFormViewModel  extends FormController {
    generateBlank() {
        return new Spell();
    }

    preparedRowVisibleEdit = () => {
        return parseInt(this.entity().level()) !== 0;
    };


    spellsPrePopFilter = (request, response) => {
        var term = request.term.toLowerCase();
        let results = [];
        if (term && term.length > 2) {
            const keys = DataRepository.spells
                    ? Object.keys(DataRepository.spells)
                    : [];
            results = keys.filter(function(name, idx, _) {
                return name.toLowerCase().indexOf(term) > -1;
            });
        }
        response(results);
    };

    delayedSpellsPrePopFilter = debounce(this.spellsPrePopFilter, 350);

    populateSpell = (label, value) => {
        var spell = DataRepository.spells[label];
        this.entity().importValues(spell);
        this.shouldShowDisclaimer(true);
    };

    setSpellSchool = (label, value) => {
        this.entity().school(value);
    }

    setSpellType = (label, value) => {
        this.entity().type(value);
    }

    setDamageType = (label, value) => {
        this.entity().damageType(value);
    }

    setSpellSaveAttribute = (label, value) => {
        this.entity().spellSaveAttribute(value);
    }

    setSpellCastingTime = (label, value) => {
        this.entity().castingTime(value);
    }

    setSpellRange = (label, value) => {
        this.entity().range(value);
    }

    setSpellComponents = (label, value) => {
        this.entity().components(value);
    }

    setSpellDuration = (label, value) => {
        this.entity().duration(value);
    }

    alwaysPreparedPopoverText = () => ('Always prepared spells will not count against total prepared spells.');

    typeOptions = Fixtures.spell.typeOptions;

    damageTypeOptions = Fixtures.spell.damageTypeOptions;

    spellSaveAttrOptions = Fixtures.spell.spellSaveAttrOptions;

    schoolOptions = Fixtures.spell.schoolOptions;

    castingTimeOptions = Fixtures.spell.castingTimeOptions;

    durationOptions = Fixtures.spell.durationOptions;

    componentsOptions = Fixtures.spell.componentsOptions;

    rangeOptions = Fixtures.spell.rangeOptions;


    // setSpellCastingAbility = (label, value) => {
    //     this.entity().castingAbility(label);
    // };

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
    //     this.shouldShowDisclaimer(true);
    // };
    //
    // setType = (label, value) => {
    //     this.entity().type(value);
    // };

    validation = {
        // submitHandler: (form, event) => {
        //     event.preventDefault();
        //     self.addFeature();
        // },
        // updateHandler: ($element) => {
        //     self.addFormIsValid($element.valid());
        // },
        // Deep copy of properties in object
        ...Spell.validationConstraints
    };
}

ko.components.register('spell-form', {
    viewModel: SpellFormViewModel,
    template: template
});
