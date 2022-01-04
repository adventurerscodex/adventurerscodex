import { Notifications } from 'charactersheet/utilities';
import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';

/**
 * A Root Level DM Object containing overview information about a campaign.
 */
export class Campaign extends KOModel {

    static __skeys__ = ['core', 'dms', 'campaign'];

    static __dependents__ = ['Core'];

    static mapping = {
        include: ['coreUuid']
    };

    coreUuid = ko.observable(null);
    setting = ko.observable();
    name = ko.observable();
    createdAt = ko.observable();

    summary = function() {
        if (this.name() && this.playerName()) {
            return this.name() + ': A story by ' + this.playerName();
        }
        return 'A long long time ago...';
    };

    // Helpers

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
        Notifications.campaign.added.dispatch(this);
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        Notifications.campaign.changed.dispatch(this);
    }

    delete = async () => {
        await this.ps.delete();
        Notifications.campaign.deleted.dispatch(this);
    }
}

Campaign.validationConstraints = {
    fieldParams: {
        name: {
            required: true,
            maxlength: 256
        },
        setting: {
            maxlength: 128
        }
    }
};
