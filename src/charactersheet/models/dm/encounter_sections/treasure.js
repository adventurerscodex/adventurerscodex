import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';
import {
    EncounterArmor,
    EncounterCoins,
    EncounterItem,
    EncounterMagicItem,
    EncounterWeapon,
} from 'charactersheet/models';

export class Treasure extends KOModel {
    static __skeys__ = ['core', 'encounters', 'treasures'];
    SHORT_DESCRIPTION_MAX_LENGTH = 100;

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'type', 'uuid']
    };

    TYPE = {
        MAGIC_ITEM: 'magic_item',
        ITEM: 'item',
        WEAPON: 'weapon',
        COINS: 'coins',
        ARMOR: 'armor'
    };

    VALUE_TYPES = {
        [this.TYPE.MAGIC_ITEM]: EncounterMagicItem,
        [this.TYPE.ITEM]: EncounterItem,
        [this.TYPE.WEAPON]: EncounterWeapon,
        [this.TYPE.COINS]: EncounterCoins,
        [this.TYPE.ARMOR]: EncounterArmor,
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    type = ko.observable();
    value = ko.observable();

    exportValues = () => {
        let value = null;
        if (!!this.value()) {
            value = this.value().exportValues();
        }
        return {
            ...ko.mapping.toJS(this, this._mapping),
            value,
        };
    }

    importValues = (values) => {
        ko.mapping.fromJS(values, this._mapping, this);
        const modelClass = this.VALUE_TYPES[this.type()];
        const modelInstance = new modelClass();
        modelInstance.importValues(values.value);
        this.value(modelInstance);
    }
}
