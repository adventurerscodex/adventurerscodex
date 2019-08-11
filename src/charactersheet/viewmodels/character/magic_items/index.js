import 'bin/knockout-bar-progress';
import {
  AbstractTabularViewModel,
  calculateTotalLoad
 } from 'charactersheet/viewmodels/abstract';
import { Fixtures, Notifications } from 'charactersheet/utilities';
import { MagicItem } from 'charactersheet/models';
import { MagicItemFormViewModel } from './form';

import autoBind from 'auto-bind';
import { findIndex } from 'lodash';
import ko from 'knockout';
import template from './index.html';

export class MagicItemsViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-magic-item';
        this.collapseAllId = '#magic-item-pane';
        autoBind(this);
    }

    modelClass () {
        return MagicItem;
    }

    sorts() {
        return {
            ...super.sorts(),
            'type asc': { field: 'type', direction: 'asc'},
            'type desc': { field: 'type', direction: 'desc'},
            'weight asc': { field: 'weight', direction: 'asc', numeric: true},
            'weight desc': { field: 'weight', direction: 'desc', numeric: true},
            'maxCharges asc': { field: 'maxCharges', direction: 'asc'},
            'maxCharges desc': { field: 'maxCharges', direction: 'desc'},
            'usedCharges asc': { field: 'usedCharges', direction: 'asc'},
            'usedCharges desc': { field: 'usedCharges', direction: 'desc'},
            'attuned asc': { field: 'attuned', direction: 'asc', booleanType: true},
            'attuned desc': { field: 'attuned', direction: 'desc', booleanType: true}
        };
    }

    async onUsedChange(magicitem) {
        await magicitem.save();
    }

    mapToChart(magicitem) {
        const magicitemIndex = findIndex(this.entities(), (entity) => {
            return entity.uuid === magicitem.uuid;
        });
        let color = Fixtures.general.colorHexList[magicitemIndex % 12];
        if (magicitem.requiresAttunement() && !magicitem.attuned()) {
            color = '#ccc';
        }
        return {
            data: {
                value: parseInt(magicitem.maxCharges()) - parseInt(magicitem.usedCharges()),
                maxValue: magicitem.maxCharges()
            },
            config: {
                strokeWidth: 2,
                trailWidth: 1,
                svgStyle: {
                    display: 'block',
                    width: '100%',
                    minHeight: '3px'
                },
                from: {
                    color: color
                },
                to: {
                    color: color
                }
            }
        };
    }

    attuneItem = async (data, event) => {
        event.stopPropagation();
        data.attuned(!data.attuned());
        await data.save();
    };

    numberOfAttuned = ko.pureComputed(() => {
        const attuned = ko.utils.arrayFilter(this.entities(), function(item) {
            return ko.utils.unwrapObservable(item.attuned) === true;
        });
        return attuned.length;
    });

    totalWeight = ko.pureComputed(() => {
        return calculateTotalLoad(this.entities());
    });

    setUpSubscriptions() {
        this.subscriptions.push(Notifications.magicitem.added.add(this.addToList));
        this.subscriptions.push(Notifications.magicitem.changed.add(this.replaceInList));
        this.subscriptions.push(Notifications.magicitem.deleted.add(this.removeFromList));
    }
}

ko.components.register('magic-items', {
    viewModel: MagicItemsViewModel,
    template: template
});
