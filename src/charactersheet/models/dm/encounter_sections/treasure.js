import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';
import {
    EncounterArmor,
    EncounterCoins,
    EncounterItem,
    EncounterMagicItem,
    EncounterWeapon,
} from 'charactersheet/models';
import { Notifications } from 'charactersheet/utilities';

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

    // Helpers

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.treasure.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.treasure.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.treasure.deleted.dispatch(this);
    }

    // Overrides

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
