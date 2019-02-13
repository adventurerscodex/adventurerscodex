import { KOModel } from 'hypnos';
import { Utility } from 'charactersheet/utilities';
import ko from 'knockout';


export class Core extends KOModel {

    static __skeys__ = ['core'];

    static mapping = {
        include: []
    };

    profileImage = ko.observable();
    playerName = ko.observable();
    name = ko.observable();
    createdAt = ko.observable();

    title = ko.pureComputed(() => {
        return `${this.name()}`;
    });

    summary = ko.pureComputed(() => {
        return `${this.playerName()}: a ${this.type.description()}.`;
    });

    displayImage = ko.pureComputed(() => {
        if (this.profileImage().url()) {
            if (this.profileImage().type() == 'url') {
                return Utility.string.createDirectDropboxLink(this.profileImage().url());
            }

            if (this.profileImage().type() == 'email') {
                return Utility.string.getGravatarUrl(this.profileImage().url());
            }
        }

        return 'https://www.gravatar.com/avatar/{}?d=mm';
    });
}

Core.validationConstraints = {
    rules: {
        playerName: {
            required: true,
            maxlength: 256
        }
    }
};
