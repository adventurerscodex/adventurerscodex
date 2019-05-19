import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { debounce } from 'lodash';

import ko from 'knockout';
import template from './index.html';

ko.bindingHandlers.collapseCard = {
    init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

        // apply bindings to trigger resize
        var innerBindingContext = ko.bindingEvent.startPossiblyAsyncContentBinding(element, bindingContext);
        ko.applyBindingsToDescendants(innerBindingContext, element);

        var value = valueAccessor();
        var hiddenCallback = ko.utils.unwrapObservable(value.hiddenCallback);
        var shownCallback = ko.utils.unwrapObservable(value.shownCallback);

        if (shownCallback) {
             // Register callbacks.
            $(element).on('show.bs.collapse', shownCallback);
            $(element).on('shown.bs.collapse', shownCallback);
        }
        if (hiddenCallback) {
             // Register callbacks.
            $(element).on('hidden.bs.collapse', hiddenCallback);
        }
        return { controlsDescendantBindings: true };
    },
    update: function(element, valueAccessor, allBindingsAccessor) {
    }
};

/* Usage example
<flip-card params={
  dataId: $data.__id,
  elementid: 'unique dom id',
  collapsable: collapsable,
  context: {
    data: $data,
    parent: $parent,
}
}>
  <div class="front">
    Front of Card
  </div>
  <div class="back">
    Back of Card
  </div>
</flip-card>

*/
export class FlipCardComponentViewModel {
    constructor(params) {
        // Unique id for the card's data
        this.dataId = ko.utils.unwrapObservable(params.dataId) || '1';
        // element id for collapsable behavior
        this.paramElementId = ko.utils.unwrapObservable(params.elementId);
        // unique identifier for this card
        this.elementId = `${this.paramElementId}_${this.dataId}`;

        this.tabId = ko.utils.unwrapObservable(params.tabId);

        // Whether or not to trigger animations on collapse
        this.collapsable = ko.observable(ko.utils.unwrapObservable(params.collapsable) || false);

        // contextual data to be passed to children objects
        this.context = params.context;

        // Whether or not this 'back' is displayed.
        this.showBack = ko.observable(false);

        // use a custom parameter
        if (params.showBack !== undefined) {
            this.showBack = params.showBack;
        }

        if (params.onFlip) {
            // callback to trigger on flip
            this.onFlip = params.onFlip;
        }

        if (params.onResize) {
            // callback on
            this.onResize = params.onResize;
        }
        // calculated element height
        this.elementMeasure = ko.observable(0).extend({ deferred: true });
        if (params.defaultHeight) {
            const paramHeight = parseInt(ko.utils.unwrapObservable(params.defaultHeight));
            if (!Number.isNaN(paramHeight)) {
                this.elementMeasure(paramHeight);
            }
        }
        this.elementHeight = ko.pureComputed(()=> {
            return `${this.elementMeasure()}px`;
        }).extend({ deferred: true });
    }

    toggleMode = (data, event) => {
        let toggleTo = (!this.showBack());
        if (data === true) { //override default behavior from function call
            toggleTo = true;

        } else if (data === false) { //override default behavior from function call
            toggleTo = false;
        }
        this.showBack(toggleTo);
        if (this.onFlip) {
            this.onFlip(this.showBack());
        }
        this.setNewHeight();
    }

    load = () => {
      // $(window).on('load', this.setNewHeight);
      // $(document).on('load', this.setNewHeight);
      // $(window).on('ready', this.setNewHeight);
        $(window).on('resize', this.setNewHeight);
        // Listen to tab changes as the window may have resized when the component
        // was off screen
        if (this.tabId) {
            $(`.nav-tabs a[href="#${this.tabId}"]`).on('shown.bs.tab', this.setNewHeight);
        }
    }

    shownCallback = () => {
        if(this.collapsable()){
            this.showBack(false);
            this.setNewHeight();
        }
    }

    hiddenCallback = () => {
        if(this.collapsable()){
            this.showBack(false);
            this.elementMeasure(0);
        }
    }

    setNewHeight = (initialSetHeight) => {
        const HEIGHT_MOD = 25;
        let setHeight = 0;
        if (this.showBack()) {
            setHeight = $(`#${this.elementId}_card > .back`).outerHeight();
        } else {
            setHeight = $(`#${this.elementId}_card > .front`).outerHeight();
        }
        if (setHeight && setHeight > 1 && setHeight !== this.elementMeasure()-HEIGHT_MOD ) {
           // Add 25 to adjust for where in the dom the height has to be set to work with
           // collapse
            this.elementMeasure(setHeight+HEIGHT_MOD);
            if (this.onResize) {
                setTimeout(this.onResize, 350);
            }
        }

    }
    koDescendantsComplete = (node) => {
        // set the height when the decendents have loaded properly.
        // Give it a bit so that the measure doesn't happen too quickly
        this.setNewHeight();//, 50);
    }
}

ko.components.register('flip-card', {
    viewModel: FlipCardComponentViewModel,
    template: template
});
