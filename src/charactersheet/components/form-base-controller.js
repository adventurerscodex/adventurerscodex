import ko from 'knockout';

export class FormBaseController {
    constructor(params) {
        // Data to be managed by this form
        // modelName is used for dynamic type generation
        const noOp = (entity) => { /* no op */ };
        this.show = params.show ? params.show : ko.observable(true);
        this.flip = params.flip ? params.flip : noOp;
        this.forceCardResize = params.forceCardResize ? params.forceCardResize : noOp;
        this.modelName = params.modelName ? params.modelName : null; // null if unused

        this.entity = ko.observable(this.generateBlank());
        this.addForm = ko.observable(false);
        this.formElementHasFocus = ko.observable(false);
        this.shouldShowDisclaimer = ko.observable(false);
        // Collects subscriptions to dispose of
        this.subscriptions = [];
        this.listeners = [];
    }

    generateBlank() {
        throw ('Generate Blank must be implemented by subclasses of FormViewModel');
    }

    setUpSubscriptions() {
        const onShow = this.show.subscribe(this.refresh);
        this.subscriptions.push(onShow);

        const setFocus = this.show.subscribe(this.focusOnFlip);
        this.subscriptions.push(setFocus);
    }

    disposeOfSubscriptions() {
        this.subscriptions.forEach((subscription) => subscription.dispose());
        this.subscriptions = [];
        this.listeners.forEach((listener) => listener.remove());
        this.listeners = [];
    }

    focusOnFlip() {
        this.formElementHasFocus(this.show());
    }

    load() {
        this.setUpSubscriptions();
    }

    async submit() {
        await this.save();
        this.flip(); // Refresh on flip
        this.notify();
    }

    async refresh () {
        this.shouldShowDisclaimer(false);
    }

    async save() {
        const response = await this.entity().ps.save();
        if (this.entity() != null) {
            this.entity().importValues(response.object);
        } else {
            this.entity(response.object);
        }
    }

    notify() {}

    reset() {
        // By the power of subscriptions, flip calls refresh;
        this.flip();
    }

    dispose() {
        this.disposeOfSubscriptions();
    }
}
