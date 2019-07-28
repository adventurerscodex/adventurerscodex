import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos/lib/models/ko';
import { Notifications } from 'charactersheet/utilities';
import ko from 'knockout';

export class ProfileImage extends KOModel {
    static __skeys__ = ['core', 'characters', 'profileImage'];
    static __dependents__ = ['Core'];

    static mapping = {
        include: ['coreUuid']
    };

    sourceUrl = ko.observable();
    email = ko.observable();
    type = ko.observable();

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.playerimage.changed.dispatch(this);
        return response.object;
    }
}
