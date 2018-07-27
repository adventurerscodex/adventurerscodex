import { KOModel } from 'hypnos';
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
}
