import ko from 'knockout';
import { KOModel } from 'hypnos';


export class Core extends KOModel {

    static __skeys__ = ['core'];

    static mapping = {
        include: [],
    };

    title = ko.pureComputed(() => {
        return `${this.playerName()}`;
    });

    summary = ko.pureComputed(() => {
        return `${this.playerName()}: a ${this.type.description()}.`;
    });

    image = ko.pureComputed(() => {
        const image = ko.unwrap(this.profileImage);
        if (!image) {
            return null;
        // TODO: FIX THIS
        // } else if (image.type() === 'email') {
        //     return image.gravatarUrl();
        } else {
            return image;
        }
    });
}
