import { KOModel } from 'hypnos';
import ko from 'knockout';

export class ShareKey extends KOModel {
    static __skeys__ = ['core', 'shareKeys'];

    static mapping = {
        include: ['coreUuid', 'password']
    };

    coreUuid = ko.observable(null);
    link = ko.observable(null);
    accessMode = ko.observable('private');
    dataVisibilityMode = ko.observable('all');
    password = ko.observable(null);
    createdAt = ko.observable(null);

    createdAtDisplay = ko.pureComputed(() => {
        var date = new Date(this.createdAt());
        return date.toLocaleDateString();
    });

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
        return response.object;
    }
}
