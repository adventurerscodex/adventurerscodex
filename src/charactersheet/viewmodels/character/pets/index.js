import './view';

import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { Fixtures, Notifications } from 'charactersheet/utilities';
import { Pet } from 'charactersheet/models';
import { PetFormViewModel } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';


export class PetsListViewModel extends AbstractTabularViewModel {

    constructor(params) {
        super(params);
        this.addFormId = '#add-pet';
        this.collapseAllId = '#pets-pane';
        autoBind(this);
    }

    modelClass () {
        return Pet;
    }

    getDefaultSort () {
        return this.sorts()['name asc'];
    }

    async onUsedChange(pet) {
        await pet.save();
    }
   
    getHealthColor(pet) {
        if (pet.isDangerous()) {
            return Fixtures.general.healthColor.dangerous;
        } else if (pet.isWarning()) {
            return Fixtures.general.healthColor.warning;
        }
        return Fixtures.general.healthColor.healthy;
    }

    mapToChart(pet) {
        return {
            data: {
                value: pet.hitPoints(),
                maxValue: parseInt(pet.maxHitPoints())
            },
            config: {
                strokeWidth: 2,
                trailWidth: 1,
                svgStyle: {
                    display: 'block',
                    width: '100%',
                    minHeight: '5px',
                    maxHeight: '5px'
                },
                from: {
                    color: this.getHealthColor(pet)
                },
                to: {
                    color:  this.getHealthColor(pet)
                }
            }
        };
    }

    sorts() {
        return {
            'name asc': { field: 'name', direction: 'asc'},
            'name desc': { field: 'name', direction: 'desc'}
        };
    }
    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.events.longRest.add(this.resetLongRestPets));
    }

    async resetLongRestPets() {
        const updates = this.entities().map(async (entity) => {
            if (entity.damage() > 0) {
                entity.damage(0);
                await entity.save();
            }
        });
        await Promise.all(updates);
    }
}

ko.components.register('pets-list', {
    viewModel: PetsListViewModel,
    template: template
});
