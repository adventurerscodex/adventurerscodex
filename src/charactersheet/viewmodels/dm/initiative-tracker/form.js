import { AbstractChildFormModel } from 'charactersheet/viewmodels/abstract';
import { PartyService, RandomNumberGeneratorService } from 'charactersheet/services';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './form.html';

export class InitiativeFormViewModel extends AbstractChildFormModel {

    constructor(params) {
        super(params);
        autoBind(this);

        this.remainingPlayers = params.remainingPlayers;
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
        const currentInitiative = PartyService.getInitiative();
        const currentOrder = currentInitiative.order || [];
        PartyService.updateInitiative({
            ...currentInitiative,
            order: [...currentOrder, ko.mapping.toJS({
                ...this.generateBlank(),
                ...player,
            })]
        });
        this.flip();
    }

    save() {
        const currentInitiative = PartyService.getInitiative();
        const currentOrder = currentInitiative.order || [];

        let order;
        const exists = currentOrder.some(item => item.uuid === this.entity().uuid());
        if (exists) {
            order = currentOrder.map(item => (
                item.uuid === this.entity().uuid()
                ? ko.mapping.toJS(this.entity())
                : item
            ));
        } else {
            order = [...currentOrder, ko.mapping.toJS(this.entity())]
        }

        PartyService.updateInitiative({
            ...currentInitiative,
            order
        });
    }

    delete() {
        const currentInitiative = PartyService.getInitiative();
        const currentOrder = currentInitiative.order || [];
        PartyService.updateInitiative({
            ...currentInitiative,
            order: currentOrder.filter(item => item.uuid !== this.entity().uuid()),
        });
    }

    validation = {

    };
}

ko.components.register('initiative-form', {
    viewModel: InitiativeFormViewModel,
    template: template
});
