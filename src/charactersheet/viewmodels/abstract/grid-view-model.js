import { AbstractTabularViewModel } from './tabular-view-model';
import ko from 'knockout';

/**
 * AbstractGridViewModel
 *
 * Provides a grid view of data, which is flippable to a form.
 *
 * @property containerId {string} dom id of the container for this grid.
 *
 * @param show {observable} whether or not this view is visible.
 *
 * @param flip {function} function to change the visibility of this view.
 **/

const noOp = (entity) => { /* no op */ };

export class AbstractGridViewModel extends AbstractTabularViewModel {
    constructor(params) {
        super(params);
        this.show = params.show ? params.show : ko.observable(true);
        this.flip = params.flip ? params.flip : noOp;
        this.forceCardResize = params.forceCardResize ? params.forceCardResize : noOp;
    }

    setUpSubscriptions() {
        const showSubscription = this.show.subscribe(this.subscribeToVisible);
        this.subscriptions.push(showSubscription);
    }

    subscribeToVisible = async () => {
        if (this.show()) {
            await this.refresh();
        }
    }
}
