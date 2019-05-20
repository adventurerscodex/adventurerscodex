import {DataRepository, Notifications} from 'charactersheet/utilities';
import { FormController } from 'charactersheet/components/form-controller-component';
import { SpellSlot } from 'charactersheet/models/character';
import campingTentWhite from 'images/camping-tent.svg';
import { debounce } from 'lodash';
import ko from 'knockout';
import meditationWhite from 'images/meditation.svg';
import template from './form.html';



export class SpellSlotFormComponentViewModel extends FormController {

    constructor (params) {
        super(params);
        this.nextSlotLevel = ko.observable(1);
        if (params.nextSlotLevel) {
            this.nextSlotLevel = params.nextSlotLevel;
        }
        this.show = ko.observable(true);
    }

    meditationWhite = meditationWhite;
    campingTentWhite = campingTentWhite;

    generateBlank () { return new SpellSlot();}

    notify = () => {
        Notifications.spellSlots.changed.dispatch();
    }

    refresh() {
        super.refresh();
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
        // submitHandler: (form, event) => {
        //     event.preventDefault();
        //     self.modalFinishedClosing();
        // },
        // updateHandler: ($element) => {
        //     self.addFormIsValid($element.valid());
        // },
        // Deep copy of properties in object
        ...SpellSlot.validationConstraints
    };
}

ko.components.register('spell-slot-form', {
    viewModel: SpellSlotFormComponentViewModel,
    template: template
});
