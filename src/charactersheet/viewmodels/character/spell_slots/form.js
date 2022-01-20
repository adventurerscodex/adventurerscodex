import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { Notifications } from 'charactersheet/utilities';
import { SpellSlot } from 'charactersheet/models/character';
import { PartyService } from 'charactersheet/services';

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

    async refresh() {
        await super.refresh();
        if (this.addForm() && this.nextSlotLevel()) {
            this.entity().level(this.nextSlotLevel());
        }
    }

    updateFormData = (spellSlot) => {
        if (ko.utils.unwrapObservable(this.entity().uuid) === ko.utils.unwrapObservable(spellSlot.uuid)) {
            // Since spell slots forms don't 'flip', we need to update their data manually
            // When they are updated
            this.refresh();
        }
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.spellslot.changed.add(this.updateFormData));
    }


    didSave(success, error) {
        super.didSave(success, error);
        PartyService.updatePresence();
    }

    didDelete(success, error) {
        super.didDelete(success, error);
        PartyService.updatePresence();
    }
}

ko.components.register('spell-slot-form', {
    viewModel: SpellSlotFormComponentViewModel,
    template: template
});
