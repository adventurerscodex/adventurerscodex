import ko from 'knockout';
import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { debounce } from 'lodash';

import template from './index.html';

ko.bindingHandlers.collapseCard = {
    init: function(element, valueAccessor, allBindingsAccessor) {
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
    },
    update:  function(element, valueAccessor, allBindingsAccessor) {
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
        this.dataId = ko.utils.unwrapObservable(params.dataId);
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

        if (params.toggleCallback) {
            this.toggleCallback = params.toggleCallback;
        }

        this.hasSaveAction = ko.observable(false);
        if (params.saveAction) {
            this.hasSaveAction(true);
            this.saveActionParam = params.saveAction;
        }
        this.hasCancelAction = ko.observable(false);
        if (params.cancelAction) {
            this.hasCancelAction(true);
            this.cancelActionParam = params.cancelAction;
        }

        this.hasEditAction = ko.observable(false);
        if (params.editAction) {
            this.hasEditAction(true);
            this.editActionParam = params.editAction;
        }

        this.editMode = ko.observable(false);
        this.showEditModeButton = ko.observable(true);

        if (params.editMode !== undefined) {
            this.editMode = params.editMode;
            this.showEditModeButton(false);
        }
        if (params.bubbleHeight) {
            this.bubbleHeight = params.bubbleHeight;
        }
        // calculated element height
        this.elementMeasure = ko.observable(0);
        if (params.defaultHeight) {
            const paramHeight = parseInt(ko.utils.unwrapObservable(params.defaultHeight));
            if (!Number.isNaN(paramHeight)) {
                this.elementMeasure(paramHeight);
            }
        }
        this.elementHeight = ko.computed(()=> {
            return `${this.elementMeasure()}px`;
        });
    }

    toggleMode = (data, event) => {
        let toggleTo = (!this.editMode());
        if (data === true) { //override default behavior from function call
            toggleTo = true;

        } else if (data === false) { //override default behavior from function call
            toggleTo = false;
        }
        this.editMode(toggleTo);
        // if (this.toggleCallback) {
        //     this.toggleCallback(this.editMode());
        // }
        this.setNewHeight();
    }

    cancelAction = (data, event) => {
        if (this.hasCancelAction()) {
            this.cancelActionParam().then(this.toggleMode(data, event));
        } else {
            this.toggleMode(data, event);
        }
    }

    saveAction = (data, event) => {
        if (this.hasSaveAction()) {
            this.saveActionParam().then(this.toggleMode(data, event));
        } else {
            this.toggleMode(data, event);
        }
    }

    editAction = (data, event) => {
        if (this.hasEditAction()) {
            this.editActionParam().then(this.toggleMode(data, event));
        } else {
            this.toggleMode(data, event);
        }
    }

    load = () => {
        const debounceHeight = debounce(this.setNewHeight, 50);
        $(window).on('load', this.setNewHeight);
        $(window).on('ready', this.setNewHeight);
        $(document).on('ready', this.setNewHeight);
        $(window).on('resize', this.setNewHeight);
      // Listen to tab changes as the window may have resized when the component
      // was off screen
        if (this.tabId) {
            $(`.nav-tabs a[href="#${this.tabId}"]`).on('shown.bs.tab', this.setNewHeight);
        }

        if (this.showEditModeButton() === false) {
          // trigger the new height on edit mode directly;
          // this.editMode.subscribe(this.setNewHeight);
        }
    }



    shownCallback = () => {
        if(this.collapsable()){
            this.editMode(false);
            this.setNewHeight();
        }
    }

    hiddenCallback = () => {
        if(this.collapsable()){
            this.editMode(false);
            this.elementMeasure(0);
        }
    }

    setNewHeight = (initialSetHeight) => {
        const HEIGHT_MOD = 25;
        let setHeight = 0;
        if (this.editMode()) {
            setHeight = $(`#${this.elementId}_card > .back`).outerHeight();
        } else {
            setHeight = $(`#${this.elementId}_card > .front`).outerHeight();
        }

        if (setHeight && setHeight > 1 && setHeight !== this.elementMeasure()-HEIGHT_MOD ) {
           // Add 25 to adjust for where in the dom the height has to be set to work with
           // collapse
            this.elementMeasure(setHeight+HEIGHT_MOD);
            if (this.bubbleHeight) {
                setTimeout(this.bubbleHeight, 350);
            }
        }

    }
}

ko.components.register('flip-card', {
    viewModel: FlipCardComponentViewModel,
    template: template
});
