import {
    AbstractChildFormModel
} from 'charactersheet/viewmodels/abstract';
import {
    Notifications
} from 'charactersheet/utilities';
import {
    SpellSlot
} from 'charactersheet/models/character';

import autoBind from 'auto-bind';
import campingTentWhite from 'images/camping-tent.svg';
import ko from 'knockout';
import meditationWhite from 'images/meditation.svg';
import template from './form.html';

export class SpellSlotFormComponentViewModel extends AbstractChildFormModel {

    constructor(params) {
        super(params);
        this.nextSlotLevel = params.nextSlotLevel;
        autoBind(this);
    }

    meditationWhite = meditationWhite;
    campingTentWhite = campingTentWhite;

    modelClass () {
        return SpellSlot;
    }

    getNextSlotLevel = () => {
        return this.nextSlotLevel();
    }
    async refresh() {
        await super.refresh();
        // Reset the textarea size when refreshing
        console.log('fix next slot level');
        if (this.addForm() && this.nextSlotLevel()) {
            this.entity().level(this.nextSlotLevel());
        }
    }

    notify = () => {
        Notifications.spellSlots.changed.dispatch();
    }
}

ko.components.register('spell-slot-form', {
    viewModel: SpellSlotFormComponentViewModel,
    template: template
});
