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

    equals(tracked) {
        return (
          ko.utils.unwrapObservable(this.max) === ko.utils.unwrapObservable(tracked.max) &&
        ko.utils.unwrapObservable(this.used) === ko.utils.unwrapObservable(tracked.used) &&
        ko.utils.unwrapObservable(this.resetsOn) === ko.utils.unwrapObservable(tracked.resetsOn));
    }

    clearValues() {
        this.max(0);
        this.used(0);
        this.resetsOn('long');
        this.type(null);
    }

    importValues(values) {
        // if (!isEmpty(values)) {
        const mapping = ko.mapping.autoignore(this, this.mapping);
        ko.mapping.fromJS(values, mapping, this);
        // }
    }

    exportValues () {
        var mapping = ko.mapping.autoignore(this, this.mapping);
        return ko.mapping.toJS(this, this.mapping);
    }
}

Tracked.validationConstraints = {
    rules: {
        max: {
            required: true,
            type: 'number',
            min: 0,
            max: 10000
        }
    }
};
