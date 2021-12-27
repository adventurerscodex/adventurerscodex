import { AbstractTabularViewModel } from 'charactersheet/viewmodels/abstract';
import ko from 'knockout';

/**
 * An abstract VM that knows how to listen for updates to nested encounters.
 */
export class AbstractEncounterListViewModel extends AbstractTabularViewModel {

    // Overrides: to handle nested lists

    addToList(item) {
        if (item && item.parent()) {
            const parent = this.deepFind(item.parent());
            parent.children.push(item);
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
