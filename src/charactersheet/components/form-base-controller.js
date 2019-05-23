import {
    CoreManager,
    Notifications
} from 'charactersheet/utilities';

import ko from 'knockout';

export class FormBaseController {
    constructor(params) {
        // Data to be managed by this form
        // modelName is used for dynamic type generation
        this.modelName = params.modelName;
        this.entity = ko.observable(this.generateBlank());
        this.addForm = ko.observable(false);
        const noOp = (entity) => {/* no op */};
        this.show = params.show ? params.show : ko.observable(true);
        // Flip Card Properties
        this.flip = params.flip ? params.flip : noOp;
        this.forceCardResize = params.forceCardResize ? params.forceCardResize : noOp;
        this.formElementHasFocus = ko.observable(false);
        this.shouldShowDisclaimer = ko.observable(false);
        // Collects subscriptions to dispose of
        this.subscriptions = [];
    }

    setUpSubscriptions () {
        const onShow = this.show.subscribe(()=>{ this.refresh();});
        this.subscriptions.push(onShow);

        const setFocus = this.show.subscribe(()=>{this.focusOnFlip();});
        this.subscriptions.push(setFocus);
    }

    disposeOfSubscriptions () {
        this.subscriptions.forEach((subscription) => subscription.dispose());
        this.subscriptions = [];
    }

    generateBlank () {
        throw('Generate Blank must be implemented by subclasses of FormViewModel');
    }

    focusOnFlip () {
        this.formElementHasFocus(this.show());
    }

    load () {
        this.setUpSubscriptions();
    }

    async submit() {
        await this.save();
        this.flip();
        this.refresh();
        this.notify();
    }

    async save () {
        const response = await this.entity().ps.save();
    }

    notify() {}

    reset = () => {
        // By the power of subscriptions, flip calls refresh;
        this.flip();
    }

    dispose = () => {
        this.disposeOfSubscriptions();
    }
}
