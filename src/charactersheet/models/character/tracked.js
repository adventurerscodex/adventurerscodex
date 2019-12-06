import 'bin/knockout-mapping-autoignore';
import 'knockout-mapping';
// import { Notifications } from 'charactersheet/utilities';
import { isEmpty } from 'lodash';
import ko from 'knockout';

export class Tracked {

    mapping = {
        include: ['max', 'used', 'resetsOn', 'type']
    };

    max = ko.observable(0);
    used = ko.observable(0);
    resetsOn = ko.observable('long');
    type = ko.observable(null);

    usesDisplay = () => {
        return (this.max() - this.used()) + '/' + this.max();
    }

    resetsOnImg = () => {
        if (this.resetsOn() === 'long') {
            return 'rest-icon long-rest-icon';
        } else if (this.resetsOn() === 'short') {
            return 'rest-icon short-rest-icon';
        } else {
            throw 'Unexpected feature resets on string.';
        }
    };

    resetsOnDescription = () => {
        if (this.resetsOn() === 'long') {
            return 'Long Rest';
        } else if (this.resetsOn() === 'short') {
            return 'Short Rest';
        } else {
            throw 'Unexpected feature resets on string.';
        }
    };

    equals(tracked) {
        return (ko.utils.unwrapObservable(this.max) === ko.utils.unwrapObservable(tracked.max)
          && ko.utils.unwrapObservable(this.used) === ko.utils.unwrapObservable(tracked.used)
          && ko.utils.unwrapObservable(this.resetsOn) === ko.utils.unwrapObservable(tracked.resetsOn));
    }

    clearValues() {
        this.max(0);
        this.used(0);
        this.resetsOn('long');
        this.type(null);
    }

    importValues(values) {
        const mapping = ko.mapping.autoignore(this, this.mapping);
        ko.mapping.fromJS(values, mapping, this);
    }

    exportValues () {
        var mapping = ko.mapping.autoignore(this, this.mapping);
        return ko.mapping.toJS(this, this.mapping);
    }
}

Tracked.validationConstraints = {
    fieldParams: {
        max: {
            required: true,
            type: 'number',
            pattern: '\\d*',
            min: 0,
            max: 10000
        }
    }
};
