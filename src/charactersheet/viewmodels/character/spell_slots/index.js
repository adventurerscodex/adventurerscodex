import 'bin/knockout-bar-progress';
import {
    Fixtures,
    Notifications
} from 'charactersheet/utilities';
import {
    flatMap,
    maxBy
} from 'lodash';
import {
    AbstractTabularViewModel
} from 'charactersheet/viewmodels/abstract';
import {
    SpellSlotFormComponentViewModel
} from './form';
import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';

class SpellSlotsViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.addFormId = '#add-spell-slot';
        this.collapseAllId = '#spell-slot-pane';
        autoBind(this);
    }
    modelName = 'SpellSlot';

    getDefaultSort() {
        return this.sorts()['level asc'];
    }

    sorts() {
        return {
            'level asc': {
                field: 'level',
                direction: 'asc',
                numeric: true
            },
            'level desc': {
                field: 'level',
                direction: 'desc',
                numeric: true
            },
            'resetsOn asc': {
                field: 'resetsOn',
                direction: 'asc'
            },
            'resetsOn desc': {
                field: 'resetsOn',
                direction: 'desc'
            }
        };
    }

    async onUsedChange(spellslot) {
        await spellslot.save();
    }

    nextSlotLevel = ko.pureComputed(() => {
        if (!this.entities().length) {
            return 1;
        }
        const currentMax = maxBy(this.entities(), (slot) => (slot.level()));
        return parseInt(currentMax.level()) + 1;
    });

    resetsOnImg = (trackable) => {
        if (trackable.resetsOn() === 'long') {
            return 'rest-icon long-rest-icon';
        } else if (trackable.resetsOn() === 'short') {
            return 'rest-icon short-rest-icon';
        } else {
            throw 'Unexpected feature resets on string.';
        }
    };

    mapToColor = (level) => {
        switch (level.toString()) {
        case '1':
            return '#e74c3c'; //'#d9534f'; // red
        case '2':
            return '#e67e22'; //'#f0ad4e'; // orange
        case '3':
            return '#f1c40f'; //'#D7DF01'; // yellow
        case '4':
            return '#1abc9c'; //'#2F972F'; // forest
        case '5':
            return '#2ecc71'; //'#01DFD7'; // teal
        case '6':
            return '#3498db'; //'#71D4E8'; // sky blue
        case '7':
            return '#9b59b6'; //'#8000FF'; // indigo
        case '8':
            return '#34495e'; //'#800080'; // purple
        case '9':
            return '#95a5a6'; //'#906713'; //brown

        default:
            return '#777';
        }
    };

    mapToChart(slot) {
        return {
            data: {
                value: parseInt(slot.max()) - parseInt(slot.used()),
                maxValue: slot.max()
            },
            config: {
                strokeWidth: 2,
                trailWidth: 1,
                from: {
                    color: this.mapToColor(slot.level())
                },
                to: {
                    color: this.mapToColor(slot.level())
                }
            }
        };
    }

    hideRow = (rowId) => {
        $(`${rowId}`).collapse('hide');
    };

    setUpSubscriptions() {
        super.setUpSubscriptions();
        const shortRest = Notifications.events.shortRest.add(this.resetShortRestFeatures);
        const longRest = Notifications.events.longRest.add(this.resetLongRestFeatures);
    }

    async resetShortRestFeatures() {
        const updates = this.entities().map(async (entity) => {
            if (entity.resetsOn() === Fixtures.resting.shortRestEnum) {
                if (entity.used() > 0) {
                    entity.used(0);
                    await entity.save();
                }
            }
        });
        await Promise.all(updates);
    }

    async resetLongRestFeatures() {
        const updates = this.entities().map(async (entity) => {
            if (entity.used() > 0) {
                entity.used(0);
                await entity.save();
            }
        });
        await Promise.all(updates);
    }
}

ko.components.register('spell-slots', {
    viewModel: SpellSlotsViewModel,
    template: template
});
