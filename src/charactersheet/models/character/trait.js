import { KOModel } from 'hypnos';
import { Notifications } from 'charactersheet/utilities';
import { Tracked } from './tracked';
import { isEmpty } from 'lodash';
import ko from 'knockout';

export class Trait extends KOModel {
    static __skeys__ = ['core', 'traits'];

    static mapping = {
        include: ['coreUuid', 'tracked'],
        tracked: {
            update: ({ data, parent, observable }) => {
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
    race = ko.observable('');
    description = ko.observable('');
    isTracked = ko.observable(false);
    tracked = ko.observable(new Tracked());

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.trait.added.dispatch(response.object);
    }

    save = async () => {
        if (!this.isTracked()) {
            this.tracked(null);
        }
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.trait.changed.dispatch(response.object);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.feat.deleted.dispatch(this);
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
