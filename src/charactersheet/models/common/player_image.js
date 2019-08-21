import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { Notifications, Utility } from 'charactersheet/utilities';
import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';
import md5 from 'blueimp-md5';

export class ProfileImage extends KOModel {
    static __skeys__ = ['core', 'characters', 'profileImage'];
    static __dependents__ = ['Core'];

    static mapping = {
        include: ['coreUuid']
    };

    sourceUrl = ko.observable();
    email = ko.observable();
    type = ko.observable();

    imageUrl = ko.pureComputed(() => {
        if (this.type() === 'email' && this.email()) {
            try {
                const hash = md5(this.email().trim());
                return `https://www.gravatar.com/avatar/${hash}?d=mm`;
            } catch(err) {
                return '';
            }
        } else if (this.sourceUrl()) {
            return Utility.string.createDirectDropboxLink(this.sourceUrl());
        }
        return Utility.GRAVATAR_BASE_URL;
    });

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
