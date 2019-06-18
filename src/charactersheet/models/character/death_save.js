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

    save = async () => {
        const response = await this.ps.save();
        Notifications.deathSaves.changed.dispatch(this);
        return response;
    }
}
