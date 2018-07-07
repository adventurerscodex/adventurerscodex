import { KOModel } from 'hypnos/lib/models/ko';
import ko from 'knockout';

/**
 * A Root Level DM Object containing overview information about a campaign.
 */
export class Campaign extends KOModel {
    static __skeys__ = ['core', 'dms', 'campaign'];

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
}
