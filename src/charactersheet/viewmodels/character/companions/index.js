import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import { Fixtures, Notifications } from 'charactersheet/utilities';
import { Companion } from 'charactersheet/models';
import { CompanionFormViewModel } from './form';

import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';


export class CompanionsListViewModel extends AbstractTabularViewModel {

    constructor(params) {
        super(params);
        this.addFormId = '#add-companion';
        this.collapseAllId = '#companions-pane';
        autoBind(this);
    }

    modelClass () {
        return Companion;
    }

    getDefaultSort () {
        return this.sorts()['name asc'];
    }

    async onUsedChange(companion) {
        await companion.save();
    }
   
    getHealthColor(companion) {
        if (companion.isDangerous()) {
            return Fixtures.general.healthColor.dangerous;
        } else if (companion.isWarning()) {
            return Fixtures.general.healthColor.warning;
        }
        return Fixtures.general.healthColor.healthy;
    }

    mapToChart(companion) {
        return {
            data: {
                value: companion.hitPoints(),
                maxValue: parseInt(companion.maxHitPoints())
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
                    color: this.getHealthColor(companion)
                },
                to: {
                    color:  this.getHealthColor(companion)
                }
            }
        };
    }

    sorts() {
        return {
            'name asc': { field: 'name', direction: 'asc'},
            'name desc': { field: 'name', direction: 'desc'},
            'armorClass asc': { field: 'armorClass', direction: 'asc'},
            'armorClass desc': { field: 'armorClass', direction: 'desc'},
            'maxHitPoints asc': { field: 'maxHitPoints', direction: 'asc'},
            'maxHitPoints desc': { field: 'maxHitPoints', direction: 'desc'},
        };
    }
    setUpSubscriptions() {
        super.setUpSubscriptions();
        this.subscriptions.push(Notifications.events.longRest.add(this.resetLongRestCompanions));
    }

    async resetLongRestCompanions() {
        const updates = this.entities().map(async (entity) => {
            if (entity.damage() > 0) {
                entity.damage(0);
                await entity.save();
            }
        });
        await Promise.all(updates);
    }
}

ko.components.register('companions-list', {
    viewModel: CompanionsListViewModel,
    template: template
});
