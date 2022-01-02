import { Utility } from 'charactersheet/utilities';
import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';

const noOp = () => {};

/**
 * An abstract VM that knows how to listen for updates to nested encounters.
 */
export class AbstractEncounterListViewModel extends AbstractTabularViewModel {

    constructor(params) {
        super(params);

        this.show = params.show ? params.show : ko.observable(true);
        this.forceCardResize = params.forceCardResize || noOp;
    }

    setUpSubscriptions() {
        super.setUpSubscriptions();

        const onShow = this.show.subscribe(this.subscribeToVisible);
        this.subscriptions.push(onShow);
    }

    async subscribeToVisible() {
        if (this.show()) {
            this.forceCardResize();
        }
    }

    // Overrides: to handle nested lists

    addToList(item) {
        if (item && item.parent()) {
            const parent = this.deepFind(item.parent());

            // There is a case where previously added children
            // are actually shared objects, so we need a new copy.
            const modelClass = this.modelClass();
            const newItem = new modelClass();
            newItem.importValues(item.exportValues());

            parent.children.push(newItem);

            if (!parent.isOpen()) {
                parent.toggleIsOpen();
            }
        } else {
            super.addToList(item);
        }
    }

    replaceInList(item) {
        if (item && item.parent()) {
            const parent = this.deepFind(item.parent());
            Utility.array.updateElement(parent.children(), item, ko.unwrap(item.uuid));
        } else {
            super.replaceInList(item);
        }
    }

    removeFromList(item) {
        if (item && item.parent()) {
            const parent = this.deepFind(item.parent());
            parent.children.remove(entry => (
                ko.unwrap(entry.uuid) === ko.unwrap(item.uuid)
            ));
        } else {
            super.removeFromList(item);
        }
    }

    // Utils

    deepFind(uuid) {
        const findFirstMatch = (entries) => (
            ko.unwrap(entries).filter((entry) => (
                ko.unwrap(entry.uuid) === uuid)
            )[0]
        );
        const findFirst = (entries, uuid) => {
            uuid = ko.unwrap(uuid);
            let match = findFirstMatch(entries);
            if (!match) {
                for (const entry of ko.unwrap(entries)) {
                    match = findFirst(entry.children)
                    if (match) { break; }
                }
            }
            return match;
        }

        return findFirst(this.entities(), uuid);
    }
}
