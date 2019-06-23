import { KOModel } from 'hypnos/lib/models/ko';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';


export class SpellSlot extends KOModel {
    static __skeys__ = ['core', 'spellSlots'];

    static mapping = {
        include: ['coreUuid', 'uuid']
    };

    coreUuid = ko.observable(null);
    uuid =ko.observable(null);
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

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
        return response.object;
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.spellslot.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.spellslot.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.spellslot.deleted.dispatch(this);
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
