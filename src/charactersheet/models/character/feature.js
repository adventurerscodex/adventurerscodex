import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import { Tracked } from './tracked';
import { isEmpty } from 'lodash';
import ko from 'knockout';

export class Feature extends KOModel {
    static __skeys__ = ['core', 'features'];

    static mapping = {
        include: ['coreUuid', 'tracked'],
        tracked: {
            update: ({ data, parent }) => {
                const tracked = new Tracked();
                if (!isEmpty(data) && !tracked.equals(data)) {
                    parent.isTracked(true);
                    tracked.importValues(data);
                } else {
                    parent.isTracked(false);
                }
                return tracked;
            }
        }
    };

    coreUuid = ko.observable(null);
    name = ko.observable('');
    level = ko.observable(1);
    characterClass = ko.observable('');
    description = ko.observable('');
    isTracked = ko.observable(false);
    tracked = ko.observable(new Tracked());

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
        return response.object;
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.feature.added.dispatch(this);
    }

    save = async () => {
        if (!this.isTracked()) {
            this.tracked(null);
        }
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.feature.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.feature.deleted.dispatch(this);
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
