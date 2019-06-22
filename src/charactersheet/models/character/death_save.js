import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';


export class DeathSave extends KOModel {
    static __skeys__ = ['core', 'deathSaves'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    used = ko.observable();
    type = ko.observable();

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.deathSaves.changed.dispatch(this);
    }
}
