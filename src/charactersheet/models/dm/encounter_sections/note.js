import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
import { KOModel } from 'hypnos';
import ko from 'knockout';
import marked from 'bin/textarea-markdown-editor/marked.min';


export class EncounterNote extends KOModel {
    static __skeys__ = ['core', 'encounters', 'note'];

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'uuid']
    };

    coreUuid = ko.observable(null);
    uuid = ko.observable(null);
    title = ko.observable('');
    contents = ko.observable('');

    load = async (params) => {
        const response = await this.ps.model.ps.read(params);
        this.importValues(response.object.exportValues());
    }

    create = async () => {
        const response = await this.ps.create();
        this.importValues(response.object.exportValues());
    }

    save = async () => {
        const response = await this.ps.save();
        this.importValues(response.object.exportValues());
    }

    delete = async () => {
        await this.ps.delete();
    }

    /* Private Methods */

    _getPlaintext = function(myString) {
        return marked(myString).replace(/<(?:.|\n)*?>/gm, '');
    };
}
