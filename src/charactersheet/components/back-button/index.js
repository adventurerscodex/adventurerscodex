import ko from 'knockout';
import template from './index.html';

/**
 * back-button component
 *
 *
 * @param pop {function} The method to go back one step
 *
 * Usage:
 * <back-button params="{
 *       column: column,
 *  }"></back-button>
 */
export class BackButtonComponent {

    constructor(params) {
        this.column = params.column;
    }

    clickBack = () => {
        this.column.pop();
    }

    css = ko.pureComputed(() => {
        const collapseOn = ko.unwrap(this.column.collapseOn).toLowerCase();
        if (collapseOn === 'xs') {
            return 'visible-xs hidden-sm hidden-md hidden-lg';
        } else if (collapseOn === 'sm') {
            return 'visible-xs visible-sm hidden-md hidden-lg';
        } else if (collapseOn === 'md') {
            return 'visible-xs visible-sm visible-md hidden-lg';
        } else if (collapseOn === 'lg') {
            return 'visible-xs visible-sm visible-md visible-lg';
        }
    });
}

ko.components.register('back-button', {
    viewModel: BackButtonComponent,
    template: template
});
