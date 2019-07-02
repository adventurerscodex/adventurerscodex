import { PersistenceService } from 'charactersheet/services/common/persistence_service';
import { debounce } from 'lodash';

import ko from 'knockout';
import template from './index.html';


/**
 * flip-card component
 *
 * A component that provides a 'flip' card. The card has a front and back, and
 * displays the front by default. Calling the 'flip' action will cause the card.
 * to display the opposite side than the one currently showing.
 *
 * @param dataId {string} Unique id for the card's data.
 *
 * @param elementId {string} element dom id containing this card
 *
 * @param tabId {string} the tab for this card. Used to resize on tab change
 *
 * @param context {object} A passthrough for handing data to child nodes
 *
 * @param collapsable {optional observable} If trueish, the card will trigger
 * animations on collapse
 *
 * @param showBack {optional observable} control "show the back of the card"
 * with an external observable
 *
 * @param onFlip {optional function} a callback when the card flips
 *
 * @param onResize {optional function} a callback when the card resizes
 *
 * @param defaultHeight {optional int} the default height, in pixels, that the
 * card will be before complete rendering. Useful to manage screen real estate
 * before load
 *

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
        this.elementMeasure = ko.observable(350).extend({ deferred: true });
        if (params.defaultHeight) {
            const paramHeight = parseInt(ko.utils.unwrapObservable(params.defaultHeight));
            if (Number.isInteger(paramHeight)) {
                this.elementMeasure(paramHeight);
            }
        }
        this.elementHeight = ko.pureComputed(()=> {
            return `${this.elementMeasure()}px`;
        }).extend({ deferred: true });
    }

    showFront = ko.pureComputed(() => !this.showBack());

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
        setTimeout(this.setNewHeight, 50);
    }

    load = () => {
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
            setTimeout(this.setNewHeight, 0);
        }
    }

    hiddenCallback = () => {
        if(this.collapsable()){
            this.showBack(false);
            this.elementMeasure(0);
        }
    }

    setNewHeight = debounce((initialHeight) => {this._setNewHeight(initialHeight);});

    _setNewHeight = (initialSetHeight) => {
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
        setTimeout(this.setNewHeight, 0);
    }
}

ko.components.register('flip-card', {
    viewModel: FlipCardComponentViewModel,
    template: template
});
