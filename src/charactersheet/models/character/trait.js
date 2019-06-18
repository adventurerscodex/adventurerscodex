import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import { Tracked } from './tracked';
import { isEmpty } from 'lodash';
import ko from 'knockout';


export class Trait extends KOModel {
    static __skeys__ = ['core', 'traits'];

    static mapping = {
        include: ['coreUuid'],
        tracked: {
            create: ({ data }) => {
                const tracked = new Tracked();
                if (!isEmpty(data)) {
                    tracked.importValues(data);
                    return tracked;
                }
                return null;
            }
            // update: ({ data }) => {
            //     const tracked = new Tracked();
            //     if (!isEmpty(data)) {
            //         tracked.importValues(data);
            //         return tracked;
            //     }
            //     return null;
            // }
        }
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    race = ko.observable('');
    description = ko.observable('');
    isTracked = ko.observable(false);
    tracked = ko.observable(null);

    save = async () => {
        const response = await this.ps.save();
        Notifications.trait.changed.dispatch(this);
        return response;
    }
}

Trait.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        race: {
            required: true,
            maxlength: 64
        }
    }
};
