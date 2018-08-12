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

    /* Private Methods */

    _getPlaintext = function(myString) {
        return marked(myString).replace(/<(?:.|\n)*?>/gm, '');
    };
}