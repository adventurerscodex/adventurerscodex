import {
  DataRepository,
  Fixtures
} from 'charactersheet/utilities';

import { CardActionButton } from 'charactersheet/components/card-action-buttons';
import { FormController } from 'charactersheet/components/form-controller-component';
import { Spell } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';


export class SpellFormViewModel  extends FormController {
    constructor(params) {
        super(params);
        autoBind(this);
    }

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

    populateSpell = (label, value) => {
        var spell = DataRepository.spells[label];
        this.entity().importValues(spell);
        this.showDisclaimer(true);
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

    validation = {
        ...Spell.validationConstraints.rules
    };
}

ko.components.register('spell-form', {
    viewModel: SpellFormViewModel,
    template: template
});
