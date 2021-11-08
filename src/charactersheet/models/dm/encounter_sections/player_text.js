import { KOModel } from 'hypnos/lib/models/ko';
import { Utility } from 'charactersheet/utilities/convenience';
import ko from 'knockout';
import marked from 'bin/textarea-markdown-editor/marked.min';


export class PlayerText extends KOModel {
    static __skeys__ = ['core', 'encounters', 'readAloudText'];

    SHORT_DESCRIPTION_MAX_LENGTH = 100;
    LONG_DESCRIPTION_MAX_LENGTH = 200;

    static mapping = {
        include: ['coreUuid', 'encounterUuid', 'name', 'description', 'uuid']
    };

    uuid = ko.observable();
    coreUuid = ko.observable();
    encounterUuid = ko.observable();
    isExhibited = ko.observable(false);
    name = ko.observable('');
    description = ko.observable('');

    // UI Methods

    longDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.LONG_DESCRIPTION_MAX_LENGTH);
    });

    shortDescription = ko.pureComputed(() => {
        return Utility.string.truncateStringAtLength(this.description(), this.SHORT_DESCRIPTION_MAX_LENGTH);
    });

    // Message Serialization Methods

    toHTML = function() {
        var description = this.description() ? this.description() : '';
        var name = this.name() ? this.name() : '';
        return '<h3>{name}</h3>&nbsp;<p>{description}</p>'.replace(
            '{name}', name
        ).replace(
            '{description}', marked(description)
        );
    };

    toJSON = function() {
        return {
            html: this.toHTML()
        };
    };
}

PlayerText.validationConstraints = {
    rules: {
        name: {
            required: true,
            maxlength: 256
        }
    }
};
