import 'bin/knockout-bar-progress';

import {
    Fixtures,
    Notifications,
    Utility } from 'charactersheet/utilities';

import { flatMap, maxBy } from 'lodash';

import { ACTableComponent } from 'charactersheet/components/table-component';
import { SpellSlot } from 'charactersheet/models/character';

import { SpellSlotFormComponentViewModel } from './form';

import campingTent from 'images/camping-tent-blue.svg';
import ko from 'knockout';
import meditation from 'images/meditation-blue.svg';
import template from './index.html';

class SpellSlotsViewModel extends ACTableComponent {
    constructor(params) {
        super(params);
        this.addFormId = '#add-spell-slot';
        this.collapseAllId = '#spell-slot-pane';

    }

    nextSlotLevel = ko.pureComputed(() => {
        if (!this.entities().length) {
            return 1;
        }
        const currentMax = maxBy(this.entities(), (slot) => (slot.level()));
        return parseInt(currentMax.level())+1;
    });

    modelClass = () => {
        return SpellSlot;
    }

    sorts() {
        return {
            'level asc': { field: 'level', direction: 'asc', numeric: true},
            'level desc': { field: 'level', direction: 'desc', numeric: true},
            'resetsOn asc': { field: 'resetsOn', direction: 'asc'},
            'resetsOn desc': { field: 'resetsOn', direction: 'desc'}
        };
    }

    getDefaultSort () {
        return this.sorts()['level asc'];
    }

    resetsOnImgSource = (trackable) => {
        if(trackable.resetsOn() === 'long') {
            return campingTent;
        } else if (trackable.resetsOn() === 'short') {
            return meditation;
        } else {
            throw 'Unexpected feature resets on string.';
        }
    };

    async load() {
        await this.refresh();
        this.setUpSubscriptions();
        this.loaded(true);
    }

    setUpSubscriptions () {
        super.setUpSubscriptions();
        const shortRest = Notifications.events.shortRest.add(this.resetShortRestFeatures);
        this.subscriptions.push(shortRest);
        const longRest = Notifications.events.longRest.add(this.resetLongRestFeatures);
        this.subscriptions.push(longRest);
    }

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

    mapToChart = (slot) => ({
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
    });

    hideRow = (rowId) => {
        $(`${rowId}`).collapse('hide');
    };

    resetShortRestFeatures = async () => {
        const updates = this.entities().map(async (entity) => {
            if (entity.resetsOn() === Fixtures.resting.shortRestEnum) {
                entity.used(0);
                await entity.ps.save();
                this.replaceInList(entity);
            }
        });
        await Promise.all(updates);
        this.notify();
    };

    resetLongRestFeatures = async () => {
        const updates = this.entities().map(async (entity) => {
            entity.used(0);
            await entity.ps.save();
            this.replaceInList(entity);

        });
        await Promise.all(updates);
        this.notify();
    };

    notify = () => {
        Notifications.spellSlots.changed.dispatch();
    }

    onUsedChange = async (spellslot) => {
        const response = await spellslot.ps.save();
        // TODO: debounce
        this.replaceInList(response.object);
        this.notify();
    }
}

ko.components.register('spell-slots', {
    viewModel: SpellSlotsViewModel,
    template: template
});
