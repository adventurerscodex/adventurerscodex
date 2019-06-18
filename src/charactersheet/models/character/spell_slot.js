import { KOModel } from 'hypnos/lib/models/ko';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';


export class SpellSlot extends KOModel {
    static __skeys__ = ['core', 'spellSlots'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    level = ko.observable(1);
    max = ko.observable(1);
    used = ko.observable(0);
    resetsOn = ko.observable('long');
    color = ko.observable('');

    spellSlots = ko.pureComputed(() => {
        return this.getMaxSpellSlots() - this.getUsedSpellSlots();
    });

    progressWidth = ko.pureComputed(() => {
        return (this.getMaxSpellSlots() - this.getUsedSpellSlots()) / this.getMaxSpellSlots();
    });

    getMaxSpellSlots() {
        return this.max() ? parseInt(this.max()) : 0;
    }

    getUsedSpellSlots() {
        return this.used() ? parseInt(this.used()) : 0;
    }

    save = async () => {
        const response = await this.ps.save();
        Notifications.spellSlots.changed.dispatch(this);
        console.log(response);
        console.log(response.object);
        return response;
    }

    create = async () => {
        const response = await this.ps.create();
        Notifications.spellSlots.changed.dispatch(this);
        console.log(response);
        console.log(response.object);
        return response;
    }
}

SpellSlot.validationConstraints = {
    rules: {
        level: {
            required: true,
            min: 0,
            max: 10000,
            type: 'number'
        },
        max: {
            required: true,
            min: 0,
            max: 10000,
            type: 'number'
        },
        used: {
            required: true,
            min: 0,
            max: 10000,
            type: 'number'
        }
    }
};
