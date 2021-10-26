import {
    AbstractChildFormModel
} from 'charactersheet/viewmodels/abstract';
import {
    Fixtures
} from 'charactersheet/utilities';
import { SELECTDATA } from 'charactersheet/constants';
import { Spell } from 'charactersheet/models';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';


export class SpellFormViewModel  extends AbstractChildFormModel {
    constructor(params) {
        super(params);
        autoBind(this);
    }

    modelClass() {
        return Spell;
    }

    prePopSource = 'spells';
    prePopLimit = SELECTDATA.LONG;

    preparedRowVisibleEdit = ko.pureComputed(() => {
        return parseInt(this.entity().level()) !== 0;
    });

    schoolOptions = Fixtures.spell.schoolOptions;
    setSchool = (label, value) => {
        this.entity().school(value);
    }

    typeOptions = Fixtures.spell.typeOptions;
    setType = (label, value) => {
        this.entity().type(value);
    }

    damageTypeOptions = Fixtures.spell.damageTypeOptions;
    setDamageType = (label, value) => {
        this.entity().damageType(value);
    }

    spellSaveAttrOptions = Fixtures.spell.spellSaveAttrOptions;
    setSaveAttribute = (label, value) => {
        this.entity().spellSaveAttribute(value);
    }

    castingTimeOptions = Fixtures.spell.castingTimeOptions;
    setCastingTime = (label, value) => {
        this.entity().castingTime(value);
    }

    rangeOptions = Fixtures.spell.rangeOptions;
    setRange = (label, value) => {
        this.entity().range(value);
    }

    componentsOptions = Fixtures.spell.componentsOptions;
    setComponents = (label, value) => {
        this.entity().components(value);
    }

    durationOptions = Fixtures.spell.durationOptions;
    setDuration = (label, value) => {
        this.entity().duration(value);
    }

    alwaysPreparedPopoverText = () => ('Always prepared spells will not count against total prepared spells.');
}

ko.components.register('spell-form', {
    viewModel: SpellFormViewModel,
    template: template
});
