import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { PartyService, RandomNumberGeneratorService } from 'charactersheet/services';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class InitiativeFormViewModel extends AbstractChildFormModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.available = params.available;
        this.include = params.include;
        this.exclude = params.exclude;
        this.defaultImageUrl = 'https://www.gravatar.com/avatar/x?d=mm'
    }

    async refresh() {
        if (this.existingData) {
            this.entity({
                ...this.generateBlank(),
                ...ko.mapping.fromJS(this.existingData),
            });
        } else {
            this.entity(this.generateBlank());
            this.addForm(true);
        }
        this.showDisclaimer(false);
    }

    modelClass() {
        return null;
    }

    generateBlank() {
        const rng = RandomNumberGeneratorService.sharedService();
        return {
            name: ko.observable(''),
            dexterityBonus: ko.observable(0),
            initiativeModifier: ko.observable(0),
            initiative: ko.observable(rng.rollDie(20)),
            imageUrl: ko.observable(this.defaultImageUrl),
            uuid: ko.observable(rng.uuid()),
        };
    }

    quickAdd(player) {
        this.include(ko.mapping.toJS({
            ...this.generateBlank(),
            ...player,
        }));
        this.flip();
    }

    save() {
        this.include(ko.mapping.toJS(this.entity()));
    }

    delete() {
        this.exclude(this.entity());
    }

    validation = {

    };
}

ko.components.register('initiative-form', {
    viewModel: InitiativeFormViewModel,
    template: template
});
