import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import { Tracked } from './tracked';
import { isEmpty } from 'lodash';
import ko from 'knockout';

export class Feature extends KOModel {
    static __skeys__ = ['core', 'features'];

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
            // update: ({ data, parent, observable }) => {
            //     const tracked = new Tracked();
            //     if (!isEmpty(data) && !tracked.equals(data)) {
            //         tracked.importValues(data);
            //         return tracked;
            //     }
            //     return null;
            // }
        }
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    level = ko.observable(1);
    characterClass = ko.observable('');
    description = ko.observable('');
    isTracked = ko.observable(false);
    tracked = ko.observable(null);

    save = async () => {
        const response = await this.ps.save();
        Notifications.feature.changed.dispatch(this);
        return response;
    }
}

Feature.formProps = {
    name: {
        required: true,
        maxlength: 256
    },
    level: {
        type: 'number',
        min: 0,
        max: 10000,
        required: true
    },
    characterClass: {
        maxlength: 64,
        required: true
    }
};

Feature.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        },
        level: {
            type: 'number',
            min: 0,
            max: 10000,
            required: true
        },
        characterClass: {
            maxlength: 64,
            required: true
        }
    }
};
