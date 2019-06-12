
import { ACTableComponent } from 'charactersheet/components/table-component';
import ko from 'knockout';

export class ACTableFormModel extends ACTableComponent {

    constructor(params) {
        super(params);
      // Data to be managed by this form
        const noOp = (entity) => { /* no op */ };
        this.show = params.show ? params.show : ko.observable(true);
        this.flip = params.flip ? params.flip : noOp;
        this.forceCardResize = params.forceCardResize ? params.forceCardResize : noOp;

        this.formElementHasFocus = ko.observable(false);
    }

    setUpSubscriptions() {
        const onShow = this.show.subscribe(this.refreshOnShow);
        this.subscriptions.push(onShow);
        const setFocus = this.show.subscribe(this.focusOnFlip);
        this.subscriptions.push(setFocus);
    }

    refreshOnShow = async () => {
        if (this.show()) {
            await this.refresh();
        }
    }

    focusOnFlip = () => {
        const setFocus = () => {
            this.formElementHasFocus(this.show());
        };
        setTimeout(setFocus, 450);
    }

    async submit() {
        await this.save();
        this.flip(); // Refresh on flip
        this.notify();
    }

    updateEntity = async (entity) => {
        await entity.updateBonuses();
        entity.markedForSave = true;
    }

    async save () {
        const updates = this.entities().map(async (entity) => {
            if (entity.markedForSave) {
                delete entity.markedForSave;
                await entity.ps.save();
            }
        });
        await Promise.all(updates);
    }

    notify() {}

    reset() {
      // By the power of subscriptions, flip calls refresh;
        this.flip();
    }

    async delete(entity) {
        await entity.ps.delete();
        this.removeFromList(entity);
        this.notify();
        this.flip();
    }

    dispose() {
        this.disposeOfSubscriptions();
    }
}
