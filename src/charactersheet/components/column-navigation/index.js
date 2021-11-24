import autoBind from 'auto-bind';
import ko from 'knockout';
import template from './index.html';
import './index.css';

export class NavigationComponentViewModel {

    sizes = ['xs', 'sm', 'md', 'lg'];

    constructor(params) {
        autoBind(this);
        this.collapseOn = params.collapseOn || 'xs';
        this.columns = ko.observableArray([]);
        this.estimatedColumns = params.estimatedColumns || 3;
        this.endColumnPadding = params.endColumnPadding || 3;

        this.push({ nodes: params.templateNodes, context: params.context });
    }

    // UI

    nextSizeUp = ko.pureComputed(() => {
        const sizeIndex = this.sizes.indexOf(ko.unwrap(this.collapseOn));
        const nextSizeIndex = sizeIndex + 1;
        if (nextSizeIndex < this.sizes.length) {
            return this.sizes[nextSizeIndex];
        } else {
            return null;
        }
    });

    existingColumnWidth = ko.pureComputed(() => (
        this.columns().length *
            (((12 - this.endColumnPadding) / ko.unwrap(this.estimatedColumns))  | 0)
    ));

    showPlaceholderView = ko.pureComputed(() => (
        ko.unwrap(this.estimatedColumns) > this.columns().length
    ));

    placeholderCss = ko.pureComputed(() => {
        const width = 12 - this.existingColumnWidth();

        if (width >= 1) {
            return `column hidden-xs well col-${this.nextSizeUp()}-${width}`;
        } else {
            return 'column hidden-xs well';
        }
    });

    columnCss = (column) => {
        let styles = `column col-xs-12 `;

        const columnWidth = (this.existingColumnWidth() / this.columns().length) | 0;
        const lastExpandedSize = this.nextSizeUp();

        // The top one is always visible & bigger than the others.
        if (column.isTop() && column.isRoot()) {
            styles += `col-${lastExpandedSize}-${columnWidth} `;
            return styles;
        }
        // If this is the last expected column, make it bigger than the rest.
        else if (column.isTop()
            && this.columns().indexOf(column) + 1 >= ko.unwrap(this.estimatedColumns)) {

            const endColumnWidth = columnWidth + this.endColumnPadding;
            styles += `col-${lastExpandedSize}-${endColumnWidth} `;
            return styles;
        }
        // If it's the top, then just make it visible.
        else if (column.isTop()) {
            styles += `col-${lastExpandedSize}-${columnWidth} `;
            return styles;
        } else {
            styles += `col-${lastExpandedSize}-${columnWidth} `;
        }

        // Now let's handle visibility for sub-columns
        const collapseOn = ko.unwrap(this.collapseOn).toLowerCase();
        if (collapseOn === 'xs') {
            styles += 'hidden-xs visible-sm visible-md visible-lg';
        } else if (collapseOn === 'sm') {
            styles += 'hidden-xs hidden-sm visible-md visible-lg';
        } else if (collapseOn === 'md') {
            styles += 'hidden-xs hidden-sm hidden-md visible-lg';
        } else if (collapseOn === 'lg') {
            styles += 'hidden-xs hidden-sm hidden-md hidden-lg';
        }

        return styles;
    };

    // Actions

    push({ component, params, context, from, ...rest }) {
        if (!!from) {
            while(!from.isTop()) {
                this.pop();
            }
        }

        const isRoot = this.columns().length === 0;

        this.columns.push(new ColumnViewModel({
            push: this.push,
            pop: this.pop,
            popToRoot: this.popToRoot,
            componentName: component,
            params,
            context,
            collapseOn: this.collapseOn,
            isTop: ko.observable(true),
            isRoot: ko.observable(isRoot),
        }));
        this._updateColumns();
    }

    pop() {
        if (this.columns().length > 1) {
            this.columns.pop();
            this._updateColumns();
        }
    }

    popToRoot() {
        if (this.columns().length > 1) {
            const first = this.columns()[0];
            first.isTop(true);
            first.isRoot(true);
            this.columns([first]);
        }
    }

    // Private

    _updateColumns() {
        for (let i = 0; i<this.columns().length; i++) {
            this.columns()[i].isTop(i === this.columns().length - 1);
        }
    }
}


class ColumnViewModel {

    constructor({
        push,
        pop,
        popToRoot,
        componentName,
        params,
        nodes,
        collapseOn,
        isTop,
        isRoot,
        context,
    }) {
        autoBind(this);
        params = { ...params, column: this };

        this._push = push;
        this._pop = pop;
        this.popToRoot = popToRoot,

        this.componentName = componentName;
        this.params = params;
        this.nodes = nodes;
        this.collapseOn = collapseOn;
        this.isTop = isTop;
        this.isRoot = isRoot;
        this.context = context;
    }

    // Actions

    push(component, params, context) {
        this._push({ component, params, context, from: this });
    }

    pop() {
        this._pop(this);
    }
}



ko.components.register('column-navigation', {
    viewModel: NavigationComponentViewModel,
    template: template
});
