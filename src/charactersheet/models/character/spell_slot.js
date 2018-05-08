import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';


export class SpellSlot extends KOModel {
    static __skeys__ = ['core', 'spellSlots'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    level = ko.observable(1);
    max = ko.observable();
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
}