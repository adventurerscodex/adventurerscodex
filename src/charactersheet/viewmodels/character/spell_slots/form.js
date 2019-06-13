import {
    FormController
} from 'charactersheet/components/form-controller-component';
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

export class SpellSlotFormComponentViewModel extends FormController {

    constructor(params) {
        super(params);
        this.nextSlotLevel = params.nextSlotLevel;
        autoBind(this);
    }

    meditationWhite = meditationWhite;
    campingTentWhite = campingTentWhite;

    getNextSlotLevel = () => {
        return this.nextSlotLevel();
    }

    generateBlank() {
        return new SpellSlot();
    }

    notify = () => {
        Notifications.spellSlots.changed.dispatch();
    }

    async refresh() {
        await super.refresh();
        // Reset the textarea size when refreshing
        if (this.addForm() && this.nextSlotLevel()) {
            this.entity().level(this.nextSlotLevel());
        }
    }

    async delete() {
        if (this.containerId) {
            $(`#${this.containerId()}`).collapse('hide');
        }
        await this.entity().ps.delete();
        this.removeFromParent(this.existingData);
        this.notify();
    }

    validation = {
        ...SpellSlot.validationConstraints.rules
    };
}

ko.components.register('spell-slot-form', {
    viewModel: SpellSlotFormComponentViewModel,
    template: template
});
